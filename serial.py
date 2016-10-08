import sys
sys.path.append('/usr/local/lib/python3.4.2/dist-packages')
import serial
from time import sleep

flagPrint = False
flagSuccess = True
weight = -1
port = "/dev/tty.usbserial"
ser = serial.Serial(port, 9600, parity=serial.PARITY_NONE,timeout=0)
if flagPrint: print ('writing') # temp
ser.write(b"\x57\x0D")
count = 0;
while count < 3:
    data = ser.read(9999)
    if len(data) > 0:
        if flagPrint: print('received ... [', data,']') # temp
        if len(data) == 16 and data[0] == 10 and data[10] == 13 and data[11] == 10 and data[14] == 13 and data[15] == 3:
            if data[12] == 48 or data[12] == 50 and data[13] == 48:
                unit = data[8:10].decode("utf-8")
                if unit == "__":
                    if flagPrint: print("Scale must be zeroed")
                    break
                else:
                    weight = float(data[1:8].decode("utf-8"))
                    flagSuccess = True
                    if flagPrint: print("Your item is " , weight , unit)
                    break
            else:
                if flagPrint: print("Scale is not stable")
                break
        else:
            if flagPrint: print("Unexpected weight response")
            break
    count += 1
    sleep(0.5)

if flagPrint: print('No response')
ser.close()

if flagSuccess: print (weight)
else: print(-1)
