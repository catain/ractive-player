import * as React from 'react';
import Media, {MediaProps} from './Media';

import Playback from './playback';
import Player from './Player';

import {fragmentFromHTML} from './utils/dom';

class Audio extends Media {
  domElement: HTMLAudioElement;

  componentDidMount() {
    super.componentDidMount();

    const {playback} = this.player;

    // tracks
    for (const track of Array.from(this.domElement.textTracks)) {
      track.addEventListener('cuechange', (e: Event) => {
        const captions = [];
        for (const cue of Array.from(track.activeCues)) {
          const html = cue.text.replace(/\n/g, '<br/>');
          captions.push(fragmentFromHTML(html));
        }

        playback.captions = captions;
      });
    }
  }

  // render method
  render() {
    const {start, player, obstructCanPlay, obstructCanPlayThrough, children, ...attrs} = this.props;

    return (
      <audio ref={node => this.domElement = node} {...attrs}>
        {children}
      </audio>
    );
  }
}

export default React.forwardRef<Audio, MediaProps>((props, ref) => (
  <Player.Context.Consumer>
    {(player: Player) => (<Audio {...props} ref={ref} player={player} />)}
  </Player.Context.Consumer>
));