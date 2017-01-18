class Waypoint {
    constructor(marker, id, floor) {
        //console.log(marker);
        this.marker = marker;
        //this.enable = false;
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

    /*get idMarker() {
        return this.marker._leaflet_id;
    }

    get isEnabled() {
        return this.enable;
    }

    set enabled(enabled) {
        this.enable = enabled;
    }

    get getFloor() {
        return this.floor;
    }*/
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

        this.toJSON = function() {

            var jsonString = "{\"local\":" + this.local + ",\"points\":[";
            var points = "";

            for (var i = 0; i < this.waypoints.length; i++) {
                if (points !== "") {
                    points += ", ";
                }

                points += this.waypoints[i];
            }

            jsonString += points + "]}";

            return jsonString;
        }

        this.getPoints = function() {
            return this.waypoints;
        }
    }
}

class Zone {
    constructor(id) {
        this.id = id;
        this.points = [];
        this.waypoints = [];
        this.removeLast = function () {
            this.points.pop();
        }
        this.removeLastWaypoints = function () {
            this.waypoints.pop();
        }
    }

    addPointToZone(point) {
        this.points.push(point);
    }

    addWaypoints(point) {
        this.waypoints.push(point);
    }

    get getPoints() {
        return this.points;
    }

    get toJSON() {
        var jsonString = "{\"id\":" + this.id + ",\"points\":[";
        var points = "";
        for (var i = 0; i < this.points.length; i++) {
            if (points !== "") {
                points += ", ";
            }

            points += this.points[i].toJSON;
        }

        jsonString += points + "],";
        var waypointsString = "";
        for (var i = 0; i < this.waypoints.length; i++) {
            if (waypointsString !== "") {
                waypointsString += ", ";
            }

            waypointsString += this.waypoints[i].toJSON;
        }
        jsonString += "\"waypoints\":[" + waypointsString + "]}";
        return jsonString;
    }

    get formatedPoints() {
        var newPoints = [];
        for (var i = 0; i < this.points.length; i++) {
            newPoints.push([this.points[i].point.lat, this.points[i].point.lng]);
        }

        return newPoints;
    }

    get formatedWaypoints() {
        var newPoints = [];
        for (var i = 0; i < this.waypoints.length; i++) {
            newPoints.push(new L.LatLng(this.waypoints[i].point.lat, this.waypoints[i].point.lng));
        }

        return newPoints;
    }

    get getId() {
        return this.id;
    }

    get getWaypoints() {
        return this.waypoints;
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
