import {HnHMaxZoom} from "../utils/LeafletCustomTypes";
import * as L from "leaflet";

export class Character {
    constructor(characterData) {
        this.name = characterData.name;
        this.position = characterData.position;
        this.type = characterData.type;
        this.id = characterData.id;
        this.map = characterData.map;
        this.marker = false;
        this.text = this.name;
        this.value = this.id;
        this.onClick = null;
    }

    getId() {
        return `${this.name}`;
    }

    remove(mapview) {
        if (this.marker) {
            mapview.map.removeLayer(this.marker);
            this.marker = null;
        }
    }

    add(mapview) {
        if (this.map == mapview.mapid) {
            let position = mapview.map.unproject([this.position.x, this.position.y], HnHMaxZoom);

            // Create a marker with a tooltip (player name)
            this.marker = L.marker(position, {
                icon: L.icon({
                    iconUrl: this.iconUrl, // Use the current icon URL
                    iconSize: [24, 24], // Replace with your icon size if different
                    iconAnchor: [12, 12], // Center the icon
                    tooltipAnchor: [0, -12] // Adjust to center tooltip above the icon
                })
            })
                .bindTooltip(this.name, { permanent: true, direction: 'top', opacity: 1 })
                .on("click", this.callCallback.bind(this))
                .addTo(mapview.map);
        }
    }

    update(mapview, updated) {
        if(this.map != updated.map) {
            this.remove(mapview);
        }
        this.map = updated.map;
        this.position = updated.position;
        if (!this.marker && this.map == mapview.mapid) {
            this.add(mapview);
        }
        if(this.marker) {
            let position = mapview.map.unproject([updated.position.x, updated.position.y], HnHMaxZoom);
            this.marker.setLatLng(position);
        }
    }

    setClickCallback(callback) {
        this.onClick = callback;
    }

    callCallback(e) {
        if(this.onClick != null) {
            this.onClick(e);
        }
    }
}
