class Waypoint {
    constructor(marker, floor, id) {
        //console.log(marker);
        this.marker = marker;
        this.enable = false;
        this.floor = floor;
        this.id = id;
    }

    get idMarker() {
        return this.marker._leaflet_id;
    }

    get id() {
        return this.id;
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

    get getFloor() {
        return this.floor;
    }
}

class FloorWaypoint extends Waypoint {
    constructor(marker, floor, id) {
        super(marker, floor, id);
    }

    get toJSON() {
        return "{\"latitude\": " + this.marker._latlng.lat +
            ", \"longitude\": " + this.marker._latlng.lng +
            ", \"floor\": " + this.floor +
            ", \"enabled\": " + this.enable +
            "}";
    }

    get toString() {
        return "Lat et Long: " + this.marker._latlng + ", Floor: " + this.floor;
    }
}

class VerticalWaypoint extends Waypoint {
    constructor(marker, floor, id) {
        super(marker, floor, id);
        this.accessibleFloors = [1, 2, 3];
        this.elevator = false;
        this.connectedWaypoint = [];
    }

    get toJSON() {
        return "{\"latitude\": " + this.marker._latlng.lat +
            ", \"longitude\": " + this.marker._latlng.lng +
            ", \"elevator\": " + this.elevator +
            ", \"floor\": " + this.floor +
            ", \"enabled\": " + this.enable +
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

    get getConnectedWaypoints() {
        return this.connectedWaypoint;
    }

    addConnectedWaypoints(id) {
        this.push(id);
    }

    removeConnectedWaypoints() {
        for (var i = 0; i < this.connectedWaypoint.length; i++) {
            if (this.connectedWaypoint[i] === id) {
                this.connectedWaypoint.splice(i, 1);
            }
        }
    }
}


class Zone {
    constructor(id) {
        this.id = id;
        this.points = [];
        this.removeLast = function () {
            this.points.pop();
        }
    }

    addPointToZone(point) {
        this.points.push(point);
    }

    get getPoints() {
        return this.points;
    }

    get toJSON() {
        var jsonString = "{\"id\":" + this.id + ",\"points\":[";
        var points = "";
        for(var i = 0; i < this.points.length; i++) {
            if(points !== "") {
                points += ", ";
            }

            points += this.points[i].toJSON;
        }

        jsonString += points + "]}";
        return jsonString;
    }

    get formatedPoints() {
        var newPoints = [];
        for(var i = 0; i < this.points.length; i++) {
            newPoints.push([this.points[i].point.lat, this.points[i].point.lng]);
        }

        return newPoints;
    }

    get getId() {
        return this.id;
    }
}

class Point {
    constructor(id, point) {
        this.id = id;
        this.point = point;
    }

    set setCoords(coords) {
        this.point = coords;
    }

    get getId() {
        return this.id;
    }

    get getCoord() {
        return this.point;
    }

    get toJSON() {
        return "{\"id\": " + this.id +
            ", \"coords\": [" + this.point.lat + ", " + this.point.lng + "]}";
    }
}
