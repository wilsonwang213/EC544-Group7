#include <Time.h>
#include <PID_v1.h>
#include <Servo.h>
#include<SoftwareSerial.h>

Servo wheels; // servo for turning the wheels
Servo esc; // not actually a servo, but controlled like one!
SoftwareSerial XBee(2, 3); // RX, TX

bool startup = true; // used to ensure startup only happens once
int startupDelay = 1000; // time to pause at each calibration step

int cmnd = 49; //Command to start/stop the car remotely
int cnt = 0;
double sum = 0.0;

double cache = 0.0;


double setPt, Input, Output;
double Kp = 7.2;     // initial 2
double Ki = 1;  // initial 0.05
double Kd = 2;   // initial 0.5

double KKp = 1.8;
double KKi = 0.25;
double KKd = 0.5;


PID PIDleft(&Input, &Output, &setPt, Kp, Ki, Kd, DIRECT);



double pulse_width;
double pulse_width1;
double pulse_width_difference;
const int pwPin = 7;

int arraysize = 9;
int rangevalue[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0};
long pulse;
int modE;

void setup()
{
  Serial.begin(9600);

  wheels.attach(11); // initialize wheel servo to Digital IO Pin #8
  esc.attach(13);// Start serial communications
  
  pinMode(2, OUTPUT); // Set pin 2 as trigger pin
  pinMode(3, INPUT); // Set pin 3 as monitor pin
  digitalWrite(2, LOW); 
  pinMode(4, OUTPUT); // Set pin 2 as trigger pin
  pinMode(5, INPUT); // Set pin 3 as monitor pin
  digitalWrite(4, LOW);//  
  pinMode(pwPin, INPUT);
 
  calibrateESC();

  setPt = 1.9;
  PIDleft.SetOutputLimits(-50,50);
  PIDleft.SetMode(AUTOMATIC);

//  esc.write(90);
//  delay(1000);
}



void loop()
{
  pulse_width = pulseIn(3, HIGH);
  pulse_width1 = pulseIn(5, HIGH);// Count how long the pulse is high in microseconds
  if(pulse_width != 0){ // If we get a reading that isn't zero, let's print it
        pulse_width = pulse_width/20 -7.4; // 10usec = 1 cm of distance for LIDAR-Lite
    Serial.print("pulse 1: ");
    Serial.println(pulse_width); // Print the distance
  }
   // Count how long the pulse is high in microseconds
  if(pulse_width1 != 0){ // If we get a reading that isn't zero, let's print it
       pulse_width1 = pulse_width1/20; // 10usec = 1 cm of distance for LIDAR-Lite
     Serial.print("pulse 2: ");
    Serial.println(pulse_width1); // Print the distance
  }
//  if (cnt<500)
//  {
//    cnt++;
//    sum+=(pulse_width-pulse_width1);
//  }
//  else
//  {
//    Serial.println("!!!!!!!!!!!!!!!!!!!!");
//    Serial.print(sum/500);
//    cnt = 0;
//    sum = 0;
//    delay(5000);
//  }

  if (pulse_width1<30)
  {
    wheels.write(75);  
  }
  else if (pulse_width1>80)
  {
    wheels.write(105);  
  }
  else
  {  
  
  for(int i = 0; i < arraysize; i++)
  {                    
    pulse = pulseIn(pwPin, HIGH);
    rangevalue[i] = pulse/58;
    //delay(10);
  }
  // Serial.print("Unsorted: ");
  isort(rangevalue,arraysize);
  // Serial.print("Sorted: ");
  modE = mode(rangevalue,arraysize);
  

  if (modE<=40)
  {
    esc.write(90);
  }
  else
  {
    esc.write(75);

    pulse_width_difference = pulse_width - pulse_width1;
    Input = pulse_width_difference;

    
    if (abs(Input-1.9)>=2.5)
      PIDleft.SetTunings(Kp,Ki,Kd);
    else
      PIDleft.SetTunings(KKp,KKi,KKd);
    
    PIDleft.Compute();
    Serial.print("input:");
    Serial.println(Input);   
    Serial.print("output:");
    Serial.println(Output);
    wheels.write(91.5+Output);
    //wheels.write(60);
    //wheels.write(80+Output);
    //XBee.print(80+Output);
  }  

  }
  // delay(1000); //Delay so we don't overload the serial port
}


void isort(int *a, int n){
// *a is an array pointer function
  for (int i = 1; i < n; ++i)
  {
    int j = a[i];
    int k;
    for (k = i - 1; (k >= 0) && (j < a[k]); k--)
    {
      a[k + 1] = a[k];
    }
    a[k + 1] = j;
  }
}

int mode(int *x,int n){

  int i = 0;
  int count = 0;
  int maxCount = 0;
  int mode = 0;
  int bimodal;
  int prevCount = 0;
  while(i<(n-1)){
    prevCount=count;
    count=0;
    while(x[i]==x[i+1]){
      count++;
      i++;
    }
    if(count>prevCount&count>maxCount){
      mode=x[i];
      maxCount=count;
      bimodal=0;
    }
    if(count==0){
      i++;
    }
    if(count==maxCount){//If the dataset has 2 or more modes.
      bimodal=1;
    }
    if(mode==0||bimodal==1){//Return the median if there is no mode.
      mode=x[(n/2)];
    }
    return mode;
  }

}

/* Calibrate the ESC by sending a high signal, then a low, then middle.*/
void calibrateESC(){
    esc.write(180); // full backwards
    delay(startupDelay);
    esc.write(0); // full forwards
    delay(startupDelay);
    esc.write(90); // neutral
    delay(startupDelay);
    esc.write(90); // reset the ESC to neutral (non-moving) value
}
