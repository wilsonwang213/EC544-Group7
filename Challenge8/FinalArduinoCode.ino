#include <Time.h>
#include <PID_v1.h>
#include <Servo.h>
#include<SoftwareSerial.h>
//version 2

Servo wheels; // servo for turning the wheels
Servo esc; // not actually a servo, but controlled like one!
SoftwareSerial XBee(2, 3); // RX, TX

bool startup = true; // used to ensure startup only happens once
int startupDelay = 1000; // time to pause at each calibration step

int cmnd = 48; //Command to start/stop the car remotely
int tmp = 54;
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



double pulse_widthleft;
double pulse_widthright;
double pulse_width_difference;
const int pwPin = 7;

int arraysize = 9;
int rangevalue[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0};
long pulse;
int modE;

void setup()
{
  Serial.begin(9600);
  XBee.begin(9600);//
  
  wheels.attach(11); // initialize wheel servo to Digital IO Pin #8
  esc.attach(13);// Start serial communications
  
  pinMode(8, OUTPUT); // Set pin 2 as trigger pin
  pinMode(9, INPUT); // Set pin 3 as monitor pin
  digitalWrite(8, LOW); 
  pinMode(4, OUTPUT); // Set pin 2 as trigger pin
  pinMode(5, INPUT); // Set pin 3 as monitor pin
  digitalWrite(4, LOW);//  
  pinMode(pwPin, INPUT);
 
  calibrateESC();

  setPt = 0;
  PIDleft.SetOutputLimits(-50,50);
  PIDleft.SetMode(AUTOMATIC);

//  esc.write(90);
//  delay(1000);
}



void loop()
{
  
  if (XBee.available())    //48 for auto-drive, 49 for web-control, 50-54:forward,back,left,right,stay 
  {
    tmp = XBee.read();
    Serial.println(tmp);
    if (tmp == 48)
      cmnd = 48;
    else if (tmp == 49)
      cmnd = 49; 
  }
  if (cmnd == 49)
  {
     if (tmp == 50)
     {
        wheels.write(91);
        esc.write(70);
     }
     else if (tmp  == 51)
     {
        wheels.write(91);
        esc.write(110);
     }
     else if (tmp == 52)
     {
        wheels.write(120);
        esc.write(70);
     }
     else if (tmp == 53)
     {
        wheels.write(60);
        esc.write(70);
     }
     else if (tmp == 54)
     {
        esc.write(91);
     }
  }
  if (cmnd == 48 && tmp == 54)
  {
      esc.write(90);
  }
  else if (cmnd == 48 && tmp == 50)
  {
  pulse_widthright = pulseIn(9, HIGH);
  pulse_widthleft = pulseIn(5, HIGH);// Count how long the pulse is high in microseconds
  if(pulse_widthleft != 0){ // If we get a reading that isn't zero, let's print it
        pulse_widthleft = pulse_widthleft/20; // 10usec = 1 cm of distance for LIDAR-Lite
    //Serial.print("pulse left: ");
    //Serial.println(pulse_widthleft); // Print the distance
  }
   // Count how long the pulse is high in microseconds
  if(pulse_widthright != 0){ // If we get a reading that isn't zero, let's print it
       pulse_widthright = pulse_widthright/20; // 10usec = 1 cm of distance for LIDAR-Lite
    //Serial.print("pulse right: ");
    //Serial.println(pulse_widthright); // Print the distance
  }
 
//  delay(500);
//    Serial.println("!!!!!!!!!!!!!!!!!!!!");
//    Serial.print(sum/500);
//    cnt = 0;
//    sum = 0;
//    delay(5000);



  
//  for(int i = 0; i < arraysize; i++)
//  {                    
//    pulse = pulseIn(pwPin, HIGH);
//    rangevalue[i] = pulse/58;
//    //delay(10);
//  }
//  isort(rangevalue,arraysize);
//  modE = mode(rangevalue,arraysize);
  modE = pulseIn(pwPin, HIGH);
  modE = modE/58;
  if (modE<0) modE = 100;
  //Serial.println(modE);
  

  if (modE<=40)
  {
    esc.write(90);
    if (abs(pulse_widthright-pulse_widthleft)<30)
    {
      esc.write(90);
    }
    else if (pulse_widthright<60)
    {
      wheels.write(91);
      esc.write(115);
      delay(1500);
      wheels.write(145);
      esc.write(70);
      delay(2250);
      wheels.write(65);
      delay(500);
    }
    else if (pulse_widthleft<50)
    {
      wheels.write(135);
      esc.write(105);
      delay(1500);
      wheels.write(60);
      esc.write(75);
      delay(1000);
    }
  }
  else
  {
    esc.write(60);
//
//
//    if (pulse_widthfront>150 && pulse_width<100)
//    {
//      wheels.write(145);
//      delay(3000);
//    }

      if (pulse_widthleft>150) // && pulse_widthright<150)
      {
        esc.write(75);
        wheels.write(175);
        //delay(1000);
      }
      else if (pulse_widthleft<30)
      {
        esc.write(75);
        wheels.write(70);
        //delay(500);
      }
      else if (pulse_widthright<40)
      {
        esc.write(75);
        wheels.write(110);
        //delay(500);
      }
      else
      {
        //esc.write(75);
      pulse_width_difference = 50 - pulse_widthleft;
      Input = pulse_width_difference;

    
      if (abs(Input)>=2.5)
        PIDleft.SetTunings(Kp,Ki,Kd);
      else
        PIDleft.SetTunings(KKp,KKi,KKd);
    
      PIDleft.Compute();
      Serial.print("input:");
      Serial.println(Input);   
      Serial.print("output:");
      Serial.println(Output);
      wheels.write(91+Output);
      //wheels.write(60);
      //wheels.write(80+Output);
      //XBee.print(80+Output);
      }

  }

  }
  
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
