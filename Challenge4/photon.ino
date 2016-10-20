#include <math.h>         //loads the more advanced math functions

double temp = 0;
int val = 0;


void setup() {            //This function gets called when the photon starts
    Particle.subscribe("hook-response/temperature1", myHandler, MY_DEVICES);


}

double Thermister(int RawADC) {  //Function to perform the fancy math of the Steinhart-Hart equation
 double average;
    average = 4095/(double)RawADC - 1;
    average = 9100 / average;
  float steinhart = average / 10000;     // (R/Ro)
  steinhart = log(steinhart);                  // ln(R/Ro)
  steinhart /= 3950;                   // 1/B * ln(R/Ro)
  steinhart += 1.0 / (20 + 273.15); // + (1/To)
  steinhart = 1.0 / steinhart;                 // Invert
  steinhart -= 273.15;  // Convert Kelvin to Celcius
  steinhart = steinhart * 1.8 + 32; //F
 return steinhart;
}

void loop() {             //This function loops while the arduino is powered
  val= analogRead(0);
  temp= Thermister(val);
  delay(1000);

  Particle.publish("temperature", String(temp), PRIVATE);

      Particle.variable("temperature", &temp, DOUBLE);

}


void myHandler(const char *event, const char *data) {
  // Handle the integration response
}
