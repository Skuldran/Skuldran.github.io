soundArray = [];

function loadSoundFiles(fileNames, label){
  soundObject = new loadedSound(fileNames, label)
  soundArray.push(soundObject)
  print('Loaded: ' + label)  
}



class loadedSound {
  constructor(fileNames, label) {
    this.label = label;
    
    this.sounds = [];
    for (let i = 0; i < fileNames.length; i++) {
      let snd = loadSound(fileNames[i])
      this.sounds.push(snd)
    }
    print('Loaded: ' + label)
  }
  
  play(vol, rate) {
    let s = random(this.sounds)
    s.setVolume(vol)
    s.rate(rate)
    s.play()
    
    return s;
  }
}

function playSound(label, vol, rate) {
  for (let i = 0; i < soundArray.length; i++){
    if (soundArray[i].label == label){
      return soundArray[i].play(vol, rate);
    }
  }
}