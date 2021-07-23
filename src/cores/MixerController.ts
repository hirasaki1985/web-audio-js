import {
  AudioEffector,
  AudioMixer,
  AudioViewEffectorBaseRefProps,
  TrackListItem,
} from '../@types/AudioType'

export default class MixerController {
  private mixer: AudioMixer

  public constructor() {
    this.mixer = {
      chains: [],
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
