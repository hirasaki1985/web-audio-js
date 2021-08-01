import {
  AudioEffector,
  AudioMixer,
  AudioViewEffectorBaseRefProps,
  TrackListItem,
} from '../@types/AudioType'
import MasterEffector from '../effectors/master/MasterEffector'

export default class MixerController {
  private mixer: AudioMixer

  public constructor(master: MasterEffector) {
    this.mixer = {
      chains: [],
      master,
    }
  }

  public createMixer(
    track: TrackListItem,
    effectors: AudioEffector<AudioViewEffectorBaseRefProps>[] = [],
  ) {
    this.mixer.chains.push({
      track,
      effectors,
    })
  }

  public getMixerChains() {
    return this.mixer.chains
  }
}
