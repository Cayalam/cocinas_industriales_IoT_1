#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define PIN_DS18B20 4
#define PIN_LLAMA 32
#define PIN_GAS 35
#define PIN_PRESION 33

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

const char* ssid = "Redmi Note 13 Pro+ 5G";
const char* password = "carlosayala";

// ── CAMBIOS PARA EL NUEVO BACKEND ────────────────────────────────────────────
// 1. URL apunta al endpoint de ingesta (no /api/lecturas/)
const char* serverUrl = "http://10.114.95.84:8000/api/ingesta/";

// 2. API key del dispositivo — debe coincidir exactamente con la del admin de Django
const char* apiKey = "clave-esp32-cocina-001";
// ─────────────────────────────────────────────────────────────────────────────

OneWire oneWire(PIN_DS18B20);
DallasTemperature sensorTemp(&oneWire);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

unsigned long ultimoEnvio = 0;
const unsigned long intervaloEnvio = 5000;

void setup() {
  Serial.begin(115200);

  pinMode(PIN_LLAMA, INPUT);
  pinMode(PIN_PRESION, INPUT);

  sensorTemp.begin();
  Wire.begin(21, 22);

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("Error OLED");
    while (true);
  }

  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("Conectando WiFi...");
  display.display();

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi conectado");
  Serial.print("IP ESP32: ");
  Serial.println(WiFi.localIP());

  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("WiFi conectado");
  display.print("IP:");
  display.println(WiFi.localIP());
  display.display();

  delay(2000);
}

void loop() {
  sensorTemp.requestTemperatures();
  float temperatura = sensorTemp.getTempCByIndex(0);
  bool errorTemp = temperatura == DEVICE_DISCONNECTED_C;

  int gasRaw = analogRead(PIN_GAS);
  int gasPct = map(gasRaw, 0, 4095, 0, 100);

  int llamaDigital = digitalRead(PIN_LLAMA);
  bool llamaDetectada = llamaDigital == LOW;

  mostrarOLED(temperatura, errorTemp, gasRaw, gasPct, llamaDetectada);

  if (millis() - ultimoEnvio >= intervaloEnvio) {
    ultimoEnvio = millis();

    if (WiFi.status() == WL_CONNECTED) {
      enviarDatosBackend(temperatura, errorTemp, gasRaw, gasPct, llamaDetectada);
    } else {
      Serial.println("WiFi desconectado. Reintentando...");
      WiFi.disconnect();
      delay(1000);
      WiFi.begin(ssid, password);
      // Esperar hasta 10 segundos para reconectar
      int intentos = 0;
      while (WiFi.status() != WL_CONNECTED && intentos < 20) {
        delay(500);
        Serial.print(".");
        intentos++;
      }
      if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nWiFi reconectado");
      } else {
        Serial.println("\nNo se pudo reconectar");
      }
    }
  }

  delay(500);
}

void enviarDatosBackend(float temperatura, bool errorTemp, int gasRaw, int gasPct, bool llamaDetectada) {
  HTTPClient http;

  bool ventiladorExtraccion = false;
  bool ventiladorInyeccion1 = false;
  bool ventiladorInyeccion2 = false;
  String estadoSistema = "NORMAL";

  if (llamaDetectada) {
    estadoSistema = "LLAMA_DETECTADA";
    ventiladorExtraccion = true;
    ventiladorInyeccion1 = false;
    ventiladorInyeccion2 = false;
  } else if (gasPct >= 70) {
    estadoSistema = "EMERGENCIA";
    ventiladorExtraccion = true;
    ventiladorInyeccion1 = true;
    ventiladorInyeccion2 = true;
  } else if (gasPct >= 30) {
    estadoSistema = "GAS_DETECTADO";
    ventiladorExtraccion = true;
    ventiladorInyeccion1 = true;
    ventiladorInyeccion2 = false;
  } else if (!errorTemp && temperatura > 40) {
    estadoSistema = "TEMPERATURA_ALTA";
    ventiladorExtraccion = true;
    ventiladorInyeccion1 = true;
    ventiladorInyeccion2 = false;
  }

  // Convertir gasRaw (0-4095) a rango esperado por el backend (0-1023)
  int nivelGasConvertido = map(gasRaw, 0, 4095, 0, 1023);

  // Presion fija hasta conectar el sensor fisico
  float presion = 1013.25;

  // Si el sensor de temperatura falla, enviar valor neutro
  float tempEnvio = errorTemp ? 20.0 : temperatura;

  String json = "{";
  json += "\"temperatura\":" + String(tempEnvio, 2) + ",";
  json += "\"nivel_gas\":" + String(nivelGasConvertido) + ",";
  json += "\"presion\":" + String(presion, 2) + ",";
  json += "\"llama_detectada\":" + String(llamaDetectada ? "true" : "false") + ",";
  json += "\"ventilador_extraccion\":" + String(ventiladorExtraccion ? "true" : "false") + ",";
  json += "\"ventilador_inyeccion_1\":" + String(ventiladorInyeccion1 ? "true" : "false") + ",";
  json += "\"ventilador_inyeccion_2\":" + String(ventiladorInyeccion2 ? "true" : "false") + ",";
  json += "\"estado_sistema\":\"" + estadoSistema + "\"";
  json += "}";

  Serial.println("JSON enviado:");
  Serial.println(json);

  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-API-Key", apiKey);  // autenticacion del dispositivo

  int httpResponseCode = http.POST(json);

  Serial.print("Respuesta backend: ");
  Serial.println(httpResponseCode);

  if (httpResponseCode > 0) {
    String respuesta = http.getString();
    Serial.println(respuesta);
  } else {
    Serial.print("Error enviando datos. Codigo: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}

void mostrarOLED(float temperatura, bool errorTemp, int gasRaw, int gasPct, bool llamaDetectada) {
  display.clearDisplay();

  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("ESP32 Sensores");

  display.setCursor(0, 14);
  display.print("Temp: ");
  if (errorTemp) {
    display.println("ERROR");
  } else {
    display.print(temperatura, 1);
    display.println(" C");
  }

  display.setCursor(0, 28);
  display.print("Gas: ");
  display.print(gasPct);
  display.print("% ");
  display.print(gasRaw);

  display.setCursor(0, 42);
  display.print("Llama: ");
  display.println(llamaDetectada ? "SI" : "NO");

  display.setCursor(0, 54);
  display.print("WiFi: ");
  display.println(WiFi.status() == WL_CONNECTED ? "OK" : "OFF");

  display.display();
}
