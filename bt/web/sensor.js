'use strict';

let ledCharacteristic = null;
let poweredOn = false;

function onConnected() {
    document.querySelector('.connect-button').classList.add('hidden');
    document.querySelector('.color-buttons').classList.remove('hidden');
    document.querySelector('.mic-button').classList.remove('hidden');
    document.querySelector('.power-button').classList.remove('hidden');
    poweredOn = true;
}

function onDisconnected() {
    document.querySelector('.connect-button').classList.remove('hidden');
    document.querySelector('.color-buttons').classList.add('hidden');
    document.querySelector('.mic-button').classList.add('hidden');
    document.querySelector('.power-button').classList.add('hidden');
}

function connect() {
    console.log('Requesting Bluetooth Device...');
        navigator.bluetooth.requestDevice({
            filters: [
              { name: '' },
              { namePrefix: '0' },
              { namePrefix: '1' },
              { namePrefix: '2' },
              { namePrefix: '3' },
              { namePrefix: '4' },
              { namePrefix: '5' },
              { namePrefix: '6' },
              { namePrefix: '7' },
              { namePrefix: '8' },
              { namePrefix: '9' },
              { namePrefix: 'a' },
              { namePrefix: 'b' },
              { namePrefix: 'c' },
              { namePrefix: 'd' },
              { namePrefix: 'e' },
              { namePrefix: 'f' },
              { namePrefix: 'g' },
              { namePrefix: 'h' },
              { namePrefix: 'i' },
              { namePrefix: 'j' },
              { namePrefix: 'k' },
              { namePrefix: 'l' },
              { namePrefix: 'm' },
              { namePrefix: 'n' },
              { namePrefix: 'o' },
              { namePrefix: 'p' },
              { namePrefix: 'q' },
              { namePrefix: 'r' },
              { namePrefix: 's' },
              { namePrefix: 't' },
              { namePrefix: 'u' },
              { namePrefix: 'v' },
              { namePrefix: 'w' },
              { namePrefix: 'x' },
              { namePrefix: 'y' },
              { namePrefix: 'z' },
              { namePrefix: 'A' },
              { namePrefix: 'B' },
              { namePrefix: 'C' },
              { namePrefix: 'D' },
              { namePrefix: 'E' },
              { namePrefix: 'F' },
              { namePrefix: 'G' },
              { namePrefix: 'H' },
              { namePrefix: 'I' },
              { namePrefix: 'J' },
              { namePrefix: 'K' },
              { namePrefix: 'L' },
              { namePrefix: 'M' },
              { namePrefix: 'N' },
              { namePrefix: 'O' },
              { namePrefix: 'P' },
              { namePrefix: 'Q' },
              { namePrefix: 'R' },
              { namePrefix: 'S' },
              { namePrefix: 'T' },
              { namePrefix: 'U' },
              { namePrefix: 'V' },
              { namePrefix: 'W' },
              { namePrefix: 'X' },
              { namePrefix: 'Y' },
              { namePrefix: 'Z' }
            ],
            optionalServices: ['generic_access']
          })
        .then(device => {
            console.log('> Found ' + device.name);
            console.log('Connecting to GATT Server...');
            device.addEventListener('gattserverdisconnected', onDisconnected)
            return device.gatt.connect();
        })
        .then(services => {
            services.forEach(service.uuid);
            service.getCharacteristic()
            .then(characteristics => {
              characteristics.forEach(characteristic => {
                  console.log(characteristic.uuid);
              });  
            });
        })
        .then(server => {
            console.log('Getting Service 0xffe5 - Light control...');
            return server.getPrimaryService(0x00FF);
        })
        .then(service => {
            console.log('Getting Characteristic 0xffe9 - Light control...');
            return service.getCharacteristic(0xffe9);
        })
        .then(characteristic => {
            console.log('All ready!');
            ledCharacteristic = characteristic;
            onConnected();
        })
        .catch(error => {
            console.log('Argh! ' + error);
        });
}

function powerOn() {
  let data = new Uint8Array([0xcc, 0x23, 0x33]);
  return ledCharacteristic.writeValue(data)
      .catch(err => console.log('Error when powering on! ', err))
      .then(() => {
          poweredOn = true;
          toggleButtons();
      });
}

function powerOff() {
  let data = new Uint8Array([0xcc, 0x24, 0x33]);
  return ledCharacteristic.writeValue(data)
      .catch(err => console.log('Error when switching off! ', err))
      .then(() => {
          poweredOn = false;
          toggleButtons();
      });
}

function togglePower() {
    if (poweredOn) {
        powerOff();
    } else {
        powerOn();
    }
}

function toggleButtons() {
    Array.from(document.querySelectorAll('.color-buttons button')).forEach(function(colorButton) {
      colorButton.disabled = !poweredOn;
    });
    document.querySelector('.mic-button button').disabled = !poweredOn;
}

function setColor(red, green, blue) {
    let data = new Uint8Array([0x56, red, green, blue, 0x00, 0xf0, 0xaa]);
    return ledCharacteristic.writeValue(data)
        .catch(err => console.log('Error when writing value! ', err));
}

function red() {
    return setColor(255, 0, 0)
        .then(() => console.log('Color set to Red'));
}

function green() {
    return setColor(0, 255, 0)
        .then(() => console.log('Color set to Green'));
}

function blue() {
    return setColor(0, 0, 255)
        .then(() => console.log('Color set to Blue'));
}

function listen() {
    annyang.start({ continuous: true });
}

// Voice commands
annyang.addCommands({
    'red': red,
    'green': green,
    'blue': blue,
    'yellow': () => setColor(127, 127, 0),
    'orange': () => setColor(127, 35, 0),
    'purple': () => setColor(127, 0, 127),
    'pink': () => setColor(180, 12, 44),
    'cyan': () => setColor(0, 127, 127),
    'white': () => setColor(127, 127, 127),
    'turn on': powerOn,
    'turn off': powerOff
});

// Install service worker - for offline support
/*
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceworker.js');
}
*/

