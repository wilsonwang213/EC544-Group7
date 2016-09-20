
// We'll use SoftwareSerial to communicate with the XBee:
#include <SoftwareSerial.h>
#include <math.h>         //loads the more advanced math functions
SoftwareSerial Xbee(2, 3); // RX, TX

void setup() {            //This function gets called when the Arduino starts
  Xbee.begin(9600);
  Serial.begin(9600);   //This code sets up the Serial port at 9600 baud rate
}
 
double Thermister(int RawADC) {  //Function to perform the fancy math of the Steinhart-Hart equation
 double Temp;
 Temp = log(((10240000/RawADC) - 10000));
 Temp = 1 / (0.001129148 + (0.000234125 + (0.0000000876741 * Temp * Temp ))* Temp );
 Temp = Temp - 273.15;              // Convert Kelvin to Celsius
 Temp = (Temp * 9.0)/ 5.0 + 32.0; // Celsius to Fahrenheit - comment out this line if you need Celsius
 return Temp;
}
 
void loop() {             //This function loops while the arduino is powered
  int val;                //Create an integer variable
  double temp;            //Variable to hold a temperature value
  val=analogRead(1);      //Read the analog port 0 and store the value in val
  temp=Thermister(val);   //Runs the fancy math on the raw analog value
  Serial.println(temp);   //Print the value to the serial port

  Xbee.println(temp);
  delay(2000);            //Wait one second before we do it again
}

