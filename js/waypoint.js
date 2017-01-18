class Waypoint {
    constructor(marker, id, floor) {
        this.marker = marker;
        this.floor = floor;
        this.id = id;
    }

    get getId() {
        return this.id;
    }

    get getMarker() {
        return this.marker;
    }

    get toJSON() {
        return "{\"id\": " + this.id +
            ", \"latitude\": " + this.marker._latlng.lat +
            ", \"longitude\": " + this.marker._latlng.lng +
            ", \"floor\": " + this.floor +
            "}";
    }
}

class Path {
    constructor(local) {
        this.local = local;
        this.waypoints = [];

        this.removeLastWaypoint = function() {
            this.waypoints.pop();
        }

        this.addWaypoint = function(point) {
            this.waypoints.push(point);
        }

        this.getPoints = function() {
            return this.waypoints;
        }
    }
    get getLocal() {
        return this.local;
    }
}
