import React from "react";
import { Media, Player } from 'react-media-player';


const YouTube = function({src}) {
    return (
        <div style={{marginLeft: '10px',marginTop: 10}}>
        <Media>
            <div className="media">
                <div className="media-player">
                    <Player src={src} />
                </div>
            </div>
        </Media>
        </div>
    )
}

export default YouTube