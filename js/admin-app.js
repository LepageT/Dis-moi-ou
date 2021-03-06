    //Toggle to know if the user add waypoints or he's creating a path.
    var creatingPath = false;

    //List of waypoints added by the user.
    var waypoints = [];
    var nextWaypointId = 1;

    //The current path. It's null until the user select a room to add a path to.
    var path = null;

    //Loading all room in an array to be able to add the path created.
    var local = [];
    loadLocal();

    //Assigning action to the control of the admin panel.
    $("#importWaypoints").on("click", loadWaypoints);
    $("#exportWaypoints").on("click", exportWaypoints);
    $("#remove").on("click", function () {
        if (creatingPath) {
            path.removeLastWaypoint();
            redrawPath(path, null);
        } else {
            waypointLayer.removeLayer(waypoints.pop().getMarker);
        }
    });
    $("#selectLocal").on("click", function () {
        $("#roomSelect").modal("show");
    })
    $("#addPath").on("click", addPathToLocal);
    $("#saveLocal").on("click", saveLocal);
    $("#createingPath").on("click", function () {
        creatingPath = !creatingPath;
    });

    $("#selectRoom").click(function () {
        selectedRoom($("#roomList").val());
    });
    map.on("click", addMarker);

    //Function to add marker when the admin is not in creating path mode.
    function addMarker(e) {
        if (!creatingPath) {
            marker = new L.marker(e.latlng, {
                draggable: 'true'
            }).addTo(waypointLayer);
            marker.on('dragend', function (event) {
                var marker = event.target;
                var position = marker.getLatLng();
                marker.setLatLng(new L.LatLng(position.lat, position.lng), {
                    draggable: 'true'
                });
                map.panTo(new L.LatLng(position.lat, position.lng));
                console.log(marker);
            });

            marker.on("click", function () {
                if (creatingPath) {
                    console.log("ID: " + getWaypoint(this).getId);
                    addToPath(getWaypoint(this).getId);
                    redrawPath(path, null);
                }
            });
            marker.bindPopup("ID: " + nextWaypointId);

            var waypoint = new Waypoint(marker, nextWaypointId, etageActuel);
            waypoints.push(waypoint);
            nextWaypointId += 1;
        }
    }

    // Methods to load data to use the admin panel.
    function loadWaypoints(show = true) {
        waypoints = [];

        $.get("data/waypoints.json", function (data) {
            map.removeLayer(waypointLayer);
            waypointLayer = L.layerGroup();
            map.addLayer(waypointLayer);

            for (var i = 0; i < data.length; i++) {
                var latlng = new L.LatLng(parseFloat(data[i].latitude), parseFloat(data[i].longitude));

                marker = new L.marker(latlng, {
                    draggable: 'true'
                });
                if (etageActuel === data[i].floor) {
                    if (show) {
                        marker.addTo(waypointLayer);
                        marker.on("click", function () {
                            if (creatingPath) {
                                addToPath(getWaypoint(this).getId);
                                redrawPath(path, null);
                                console.log(path);
                            }
                        });
                        marker.on('dragend', function (event) {
                            var marker = event.target;
                            var position = marker.getLatLng();
                            marker.setLatLng(new L.LatLng(position.lat, position.lng), {
                                draggable: 'true'
                            });
                            map.panTo(new L.LatLng(position.lat, position.lng))
                        });
                        marker.bindPopup("ID: " + data[i].id);
                    }
                }

                var waypoint = new Waypoint(marker, data[i].id, data[i].floor);
                if (nextWaypointId < data[i].id) {
                    nextWaypointId = data[i].id;
                }

                waypoints.push(waypoint);
            }
            nextWaypointId++;
        }, 'json');
    }

    function loadLocal() {
        $.ajax({
            url: "data/listelocaux.json",
            context: document.body,
            dataType: "json"
        }).success(function (data) {
            local = data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].local.length > 0 && data[i].local !== " ") {
                    var optionClass = "";
                    if (data[i].hasOwnProperty("path")) {
                        if (data[i].path.length > 0) {
                            optionClass = "green";
                        }
                    } else {
                        $('#roomList').append("<option class=\"" + optionClass + "\"value=" + data[i].local + ">" + data[i].local + "</option>");
                    }
                }
            }
        });
    }
    //End - Loading methods

    //Methods to export the waypoints and the new rooms file with path.
    function exportWaypoints() {
        if (waypoints.length > 0) {
            var waypointsString = "";
            for (var i = 0; i < waypoints.length; i++) {
                if (waypointsString !== "") {
                    waypointsString += ", ";
                }
                waypointsString += waypoints[i].toJSON;
            }

            var myJson = "[" + waypointsString + "]";
            saveJSONToFile(myJson, "waypoints");
        }
    }

    function saveLocal() {
        saveJSONToFile(JSON.stringify(local), "listeRoom");
    }
    //End - Methods to export

    //Utility methods
    function getWaypoint(marker) {
        for (var i = 0; i < waypoints.length; i++) {
            if (waypoints[i].getMarker._leaflet_id == marker._leaflet_id) {
                return waypoints[i];
            }
        }
    }

    function selectedRoom(roomId) {
        path = new Path(roomId);
    }

    function addToPath(id) {
        if (path !== null) {
            path.addWaypoint(id);
        } else {
            alert("Select a room");
        }
    }

    function addPathToLocal() {
        for (var i = 0; i < local.length; i++) {
            if (path.getLocal == local[i].local) {
                local[i].path = path.getPoints();
                return;
            }
        }
    }

    function saveJSONToFile(json, filename) {
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(json));
        a.setAttribute('download', filename + ".json");
        a.click();
    }
    //End - Utility Methods
