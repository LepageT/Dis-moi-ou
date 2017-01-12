class Waypoint {
    constructor(marker) {
        //console.log(marker);
        this.marker = marker;
        this.enable = false;
    }

    get id() {
        return this.marker._leaflet_id;
    }

    get getMarker() {
        return this.marker;
    }

    get isEnabled() {
        return this.enable;
    }

    set enabled(enabled) {
        this.enable = enabled;
    }
}

class FloorWaypoint extends Waypoint {
    constructor(marker, floor) {
        super(marker);
        this.floor = floor;
    }

    get toJSON() {
        return "{\"latitude:\": " + this.marker._latlng.lat +
            ", \"longitude:\": " + this.marker._latlng.lng +
            ", \"floor:\": " + this.floor +
            ", \"enabled:\": " + this.enable +
            "}";
    }

    get toString() {
        return "Lat et Long: " + this.marker._latlng + ", Floor: " + this.floor;
    }
}

class VerticalWaypoint extends Waypoint {
    constructor(marker) {
        super(marker);
        this.accessibleFloors = [1, 2, 3];
        this.elevator = false;
    }

    get toJSON() {
        return "{\"latitude:\": " + this.marker._latlng.lat +
            ", \"longitude:\": " + this.marker._latlng.lng +
            ", \"elevator:\": " + this.elevator +
            ", \"enabled:\": " + this.enable +
            ", \"accessibleFloors\": [" + this.accessibleFloors +
            "]}";
    }

    get toString() {
        return "Lat et Long: " + this.marker._latlng + ", Accessible floors: " + this.accessibleFloors + ", Elevator: " + this.elevator;
    }

    set setElevator(elevator) {
        this.elevator = elevator;
    }

    set setFloors(floors) {
        this.accessibleFloors = floors;
    }
}
