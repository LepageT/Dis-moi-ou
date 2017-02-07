        // Initialisation de quelques variables, pour régler certains problèmes en rapport avec leurs scope dans les fonctions
        var imageUrl,
            imageBounds = "",
            planEtage = "",
            lc = "",
            marqueurs = "",
            libelleEtage = "",
            iconesEtage = "",
            accessibiliteEtage = "",
            urgenceEtage = "",
            numeroLocauxEtage = "",
            marqueur = "",
            etageActuel = 1,
            waypoints = [],
            listeLocauxObj = [],
            myPath = null,
            showAccessibilite = true,
            showUrgence = true,
            PSV = null;

        var waypointLayer = L.layerGroup();
        var pathLayer = L.layerGroup();

        // Limite de la carte (Déasactivé...drôle de comportement sur mobile)
        /*--------
        var southWest = L.latLng(46.828064, -71.230556);
        var northEast = L.latLng(46.832086, -71.224612);
        var bounds = L.latLngBounds(southWest, northEast);
        ---------*/

        // Affiche la carte (Centré sur le Cegep de limoilou)
        map = new L.Map('map', {
            center: new L.LatLng(46.8302871, -71.227337),
            zoom: 18,
            minZoom: 17,
            maxZoom: 21,
            zoomControl: false,
            scrollWheelZoom: 'center'
        });

        // S'assure que la carte prend tout l'espace restant dans la fenêtre du navigateur
        function redimensionnerCarte() {
            // Redimensionne la carte
            $("#map").height($(window).height());
        }

        /* Controlle étage version 1 */
        $("#controlleEtage ul li").click(function (event) {
            $("#controlleEtage ul li").removeClass("etageActif")
            $(this).addClass("etageActif");
        });

        // Affiche certains calques SVG selon le niveau de zoom de la carte
        function afficheLorsZoom() {
            if (map.getZoom() >= 19 && libelleEtageUrl !== '') {
                map.addLayer(libelleEtage);
            }

            if (map.getZoom() < 19) {
                map.removeLayer(libelleEtage);
            }

            if (map.getZoom() >= 20) {
                map.addLayer(numeroLocauxEtage);
            }

            if (map.getZoom() < 20) {
                map.removeLayer(numeroLocauxEtage);
            }
        };

        function toggleAccessibilite() {
            if (showAccessibilite) {
                map.removeLayer(accessibiliteEtage);
                showAccessibilite = false;
                $("#imgAccess").attr("src", "images/boutons_etages/active-accessibilite.svg");
            } else {
                if (accessibiliteEtage !== "") {
                    map.addLayer(accessibiliteEtage);
                }
                $("#imgAccess").attr("src", "images/boutons_etages/accessibilite.svg");
                showAccessibilite = true;
            }
        }

        function toggleUrgence() {
            if (showUrgence) {
                map.removeLayer(urgenceEtage);
                showUrgence = false;
                $("#imgFeu").attr("src", "images/boutons_etages/active-feu.svg");
            } else {
                if (urgenceEtage !== "") {
                    map.addLayer(urgenceEtage);
                }
                $("#imgFeu").attr("src", "images/boutons_etages/feu.svg");
                showUrgence = true;
            }
        }

        // Fonction pour changer les plans des étages selon le besoin.
        function changerEtage(etage) {

            if (etage == -1) {
                $("#indicateurEtage").text("SS");
            } else {
                $("#indicateurEtage").text(etage);
            }

            if ($("#controlleEtage").is(":visible")) {
                $("#controlleEtage").fadeTo(150, 0, function () {
                    $(this).hide();
                });
            }

            // Efface la calque qui contient l'image du plan de l'étage
            map.removeLayer(marqueur);
            map.removeLayer(planEtage);
            map.removeLayer(libelleEtage);
            map.removeLayer(iconesEtage);
            map.removeLayer(numeroLocauxEtage);
            map.removeLayer(accessibiliteEtage);
            map.removeLayer(urgenceEtage);
            etageActuel = etage;

            if (etage == -1) {
                imageUrl = 'images/etages/etage0_locaux.svg';
                imageLocauxUrl = 'images/etages/etage0_numero.svg'
                iconesEtageUrl = 'images/etages/etage0_icones.svg';
                libelleEtageUrl = 'images/etages/etage0_libelle.svg';
                urgenceUrl = 'images/etages/etage0_urgence.svg';
                accessibiliteUrl = 'images/etages/etage0_accessibilite.svg';
            } else {
                imageUrl = 'images/etages/etage' + etage + '_locaux.svg';
                imageLocauxUrl = 'images/etages/etage' + etage + '_numero.svg'
                iconesEtageUrl = 'images/etages/etage' + etage + '_icones.svg';
                libelleEtageUrl = 'images/etages/etage' + etage + '_libelle.svg';
                urgenceUrl = 'images/etages/etage' + etage + '_urgence.svg';
                accessibiliteUrl = 'images/etages/etage' + etage + '_accessibilite.svg';
            }

            if (etage == -1) {
                imageBounds = [[46.8294243, -71.2286517], [46.8314, -71.2256881]];
            } else if (etage == 1) {
                imageBounds = [[46.8288074, -71.2289322], [46.8316386, -71.2252248]];
            } else if (etage == 2) {
                imageBounds = [[46.8291313, -71.228653], [46.831318, -71.225684]];
            } else if (etage == 3) {
                imageBounds = [[46.8291017, -71.2283308], [46.830922, -71.2258206]];
            } else if (etage == 4) {
                imageBounds = [[46.829521, -71.228328], [46.8306627, -71.2263944]];
                libelleEtageUrl = 'images/etages/vide.svg';
            } else if (etage == 5) {
                imageBounds = [[46.8297179, -71.2283872], [46.8306298, -71.2269909]];
                libelleEtageUrl = '';
            }

            // Calque des numéros des locaux sur l'étage (est seulement ajouter lorsque beacoup zoomer dans la carte)
            numeroLocauxEtage = L.imageOverlay(imageLocauxUrl, imageBounds);
            map.addLayer(numeroLocauxEtage);

            iconesEtage = L.imageOverlay(iconesEtageUrl, imageBounds);
            map.addLayer(iconesEtage);

            libelleEtage = L.imageOverlay(libelleEtageUrl, imageBounds);

            planEtage = L.imageOverlay(imageUrl, imageBounds);
            // Ajoute et affiche l'image du sous-sol
            map.addLayer(planEtage);

            urgenceEtage = L.imageOverlay(urgenceUrl, imageBounds);
            if (showUrgence) {
                map.addLayer(urgenceEtage);
            }

            accessibiliteEtage = L.imageOverlay(accessibiliteUrl, imageBounds);

            if (showAccessibilite) {
                map.addLayer(accessibiliteEtage);
            }

            // Affiche la carte en arrière-plan de tout les autres calque. Nécésaire pour voir le point de géolocalisation après avoir changer d'étage
            planEtage.bringToBack();
            afficheLorsZoom();
            map.panTo([46.8302871, -71.227337]);
            if (myPath !== null) {
                redrawPath(myPath);
            }

        } // Fin fonction changerEtage()

        // Ca contenir la postion du marqueur en object javascript dans le format ---> [lat, long]
        var positionMarqueur = "";

        //Methods to show the path the user is creating.
        function redrawPath(path, destination = null) {
            map.removeLayer(pathLayer);
            pathLayer = L.layerGroup();
            map.addLayer(pathLayer);
            drawPath(path, destination);
        }

        function drawPath(path, destination = null) {
            if (waypoints.length > 0 && path != null) {
                var points = [];

                if (destination !== null) {
                    points.push(destination);
                }

                for (var i = 0; i < path.getPoints().length; i++) {
                    var waypoint = getWaypointById(path.getPoints()[i]);
                    if (waypoint.floor == etageActuel) {
                        points.push(getWaypointById(path.getPoints()[i]).getMarker._latlng);
                    }
                }

                var polyline = new L.Polyline(points, {
                    color: "red",
                    weight: 3,
                    smoothFactor: 1
                });
                polyline.addTo(pathLayer);
            }
        }

        function getWaypointById(id) {
            for (var i = 0; i < waypoints.length; i++) {
                if (waypoints[i].getId == id) {
                    return waypoints[i];
                }
            }
        }

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
                    if (show) {
                        if (nextWaypointId < data[i].id) {
                            nextWaypointId = data[i].id;
                        }
                    }

                    waypoints.push(waypoint);
                }
                if (show) {
                    nextWaypointId++;
                }
            }, 'json');
        }

        //End - Methods to show the path

        function getLocalInfo(local) {
            for (var i = 0; i < listeLocauxObj.length; i++) {
                if (listeLocauxObj[i].local == local) {
                    return listeLocauxObj[i];
                }
            }
            return null;
        }

        // Fonction appellé chaque fois que l'on veux afficher un marqueur sur la carte pour montrer l'emplacement d'un local
        function afficherMarqueur(localToShow) {
            var localObj = getLocalInfo(localToShow);

            var message = "<strong>" + localObj.nom + "</strong><br>" + localObj.message,
                position = localObj.position,
                etage = localObj.etage,
                local = localToShow;

            // Supprime le calque "marqueur" qui contient le ou les marqueurs
            map.removeLayer(marqueur);

            // Transforme le string "postition" en objet pour être capable de l'afficher
            positionMarqueur = JSON.parse(position);

            // Affiche le bon étage selon le local
            changerEtage(etage);

            // Crée un marqueur et le fait rebondir selon les paramètres "duration" et "height"
            var button = '<button type="button" class="btn btn-default" id="test" data-toggle="modal" data-target="#modalImage"><i class="material-icons">&#xE410;</i></button> <br><br>';

            if (!localObj.hasOwnProperty("image") && !localObj.hasOwnProperty("image360")) {
                button = "";
            }

            // Crée un marqueur et le fait rebondir selon les paramètres "duration" et "height"
            marqueur = L.marker(positionMarqueur, {
                bounceOnAdd: true,
                bounceOnAddOptions: {
                    duration: 500,
                    height: 200
                }
            }).bindPopup(button + message);

            // Créé un nouveau calque, ajoute le marqueur puis l'affiche sur la carte
            map.addLayer(marqueur);

            //Ouvre le popup du marqueur automatiquement (Contient la variable "message" de la fonction afficheMarqueur())
            marqueur.openPopup();

            // Ferme la fênetre modale
            $('#modalRechercher').modal('hide')
                // Ferme fenêtre modale itinéraire
            $('#modalItineraire').modal('hide')

            // Centre le marqueur dans l'écran
            map.panTo(positionMarqueur);

            //source pour titre message
            $('#labelMessage').html(message);
            if (localObj.hasOwnProperty("ouverture")) {
                $('#ouverture').html(localObj.ouverture);
            } else {
                $("#ouverture").html("");
            }

            if (localObj.hasOwnProperty("description")) {
                $('#description').html(localObj.description);
            } else {
                $("#description").html("");
            }

            //Afficher le path jusqu'au local
            if (localObj.hasOwnProperty("path")) {
                myPath = new Path(local, localObj.path);
                redrawPath(myPath, positionMarqueur);
            } else {
                myPath = null;
                redrawPath(myPath, null);
            }

            if (localObj.hasOwnProperty("image360")) {
                var divImage = document.getElementById('image360');
                $("#image-pano").show();
                $("#image360").show();
                $("#imgModal").hide();

                PSV = new PhotoSphereViewer({
                    panorama: 'images/img360/' + localObj.image360,
                    container: divImage,
                    autoload: false,
                    time_anim: false,
                    navbar: ['zoom', 'caption', 'fullscreen'],
                    navbar_style: {
                        backgroundColor: 'rgba(58, 67, 77, 0.7)'
                    },
                    mousewheel: false,
                    mousemove: true,
                    caption: 'Dis-moi où <b>&copy; Guillaume Bernier</b>',
                    webgl: true
                });
            } else {
                PSD = null;
                $("#image-pano").hide();
                $("#image360").hide();
                // Modifie la source de l'image
                if (localObj.hasOwnProperty("image")) {
                    $('#imgModal').attr("src", "images/" + localObj.image);
                    $("#imgModal").show();
                }
            }
        };

        // Document ready function
        $(function () {
            $("#boutonAfficherEtage").click(function () {
                if ($("#controlleEtage").is(":visible")) {
                    $("#controlleEtage").fadeTo(150, 0, function () {
                        $(this).hide();
                    });
                } else {
                    $(this).show();
                    $("#controlleEtage").fadeTo(150, 1);
                }
            });
            redimensionnerCarte();

            var routesUrl = 'images/etages/routes.svg';
            var routesBounds = [[46.8274718, -71.2311092], [46.8333687, -71.2232114]];
            var routes = L.imageOverlay(routesUrl, routesBounds).addTo(map);

            // Affiche le plan du 1er étage par defaut
            changerEtage(1);

            // Appellé lorsque la fenêtre est redimensionner
            $(window).resize(function () {
                redimensionnerCarte();
            });

            // Affiche seulement les marqueurs des portes si la carte est asser zoomer (Level 19)
            map.on('zoomend', afficheLorsZoom);
            $("#inputRechercherModal").keydown(function (e) {
                if (!e) {
                    var e = window.event;
                }

                // Enter is pressed
                if (e.keyCode == 13) {
                    $("#boutonOK").click();
                }
            });

            // Ouvre la fenêtre modale avec le bouton dans le menu de navigation
            $("#boutonRechercher").click(function (event) {
                event.preventDefault();
                $('#inputRechercherModal').val("");
                $(function () {
                    $('#listeLocaux').liveFilter('#inputRechercherModal', 'li', {
                        filterChildSelector: 'a',
                        after: function () {
                            if ($("#listeLocaux li:visible").length > 0) {
                                $("#aucunResultat").remove();
                            }

                            if ($("#inputRechercherModal").val().length > 0) {
                                $("#listePoi").toggle(false);
                                $("#containerResultatRecherche").toggle(true);
                                if ($("#listeLocaux li:visible").length == 0) {
                                    if ($("#aucunResultat").length == 0) {
                                        $("#containerResultatRecherche").append("<li id='aucunResultat'>Aucun résultat</li>");
                                    }
                                }
                            } else if ($("#inputRechercherModal").val().length == 0) {
                                $("#listePoi").toggle(true);
                                $("#containerResultatRecherche").toggle(false);
                            }
                        }
                    });
                });

                $("#modalRechercher").modal('show');

                $('#modalRechercher').on('shown.bs.modal', function () {
                    $("#boutonOK").click(function () {
                        $('#listeLocaux').liveFilter('#inputRechercherModal', 'li', {
                            filterChildSelector: 'a',
                            after: function () {
                                if ($("#listeLocaux li:visible").length > 0) {
                                    $("#aucunResultat").remove();
                                }

                                if ($("#inputRechercherModal").val().length > 0) {
                                    $("#listePoi").toggle(false);
                                    $("#containerResultatRecherche").toggle(true);
                                    if ($("#listeLocaux li:visible").length == 0) {
                                        if ($("#aucunResultat").length == 0) {
                                            $("#containerResultatRecherche").append("<li id='aucunResultat'>Aucun résultat</li>");
                                        }
                                    }
                                } else if ($("#inputRechercherModal").val().length == 0) {
                                    $("#listePoi").toggle(true);
                                    $("#containerResultatRecherche").toggle(false);
                                }
                            }
                        });
                    });
                    $(this).find('[autofocus]').focus();

                }); // fin boutonOK.click
            });

            // Ouvre la fenêtre modale avec le bouton dans le menu de navigation
            $("#boutonInformations").click(function (event) {
                event.preventDefault();
                $("#modalInformations").modal('show');
            });

            // Ouvre la fenêtre modale avec le bouton légende dans le menu de navigation

            $("#boutonLegende").click(function (event) {
                event.preventDefault();
                $("#modalLegende").modal('show');
            });

            // Ouvre la fenêtre modale itineraire avec le bouton dans le menu de navigation
            $("#boutonItineraire").click(function (event) {
                event.preventDefault();
                $("#modalItineraire").modal('show');
            });

            // Pour améliorer les performances avec jQuery
            var listeLocaux = $("#listeLocaux");

            // Ajoute via AJAX chaque locaux dans la liste de recherche (via le fichier listelocaux.json)
            $.ajax({
                url: "data/listelocaux.json",
                context: document.body,
                dataType: "json"
            }).success(function (data) {
                var elements = "",
                    nomLocal,
                    numeroLocal,
                    positionLocal,
                    etageLocal,
                    message,
                    image = null;
                listeLocauxObj = data;
                /* console.info("Nombre de locaux à ajouter: " + data.length); */
                for (i = 0; i < data.length; i++) {
                    nomLocal = data[i].nom;
                    numeroLocal = data[i].local;
                    positionLocal = data[i].position;
                    etageLocal = data[i].etage;
                    message = data[i].message;
                    image = null;
                    var level = '';
                    if (data[i].hasOwnProperty("image")) {
                        image = data[i].image;
                    }
                    // Selon chaque étage
                    if (etageLocal == -1) {
                        level = 'Sous-sol';
                    } else if (etageLocal == 1) {
                        level = etageLocal + 'er étage';
                    } else {
                        level = etageLocal + 'e étage';
                    }

                    elements += '<li><a href=\"javascript:afficherMarqueur(\'' + numeroLocal + '\')">' + '<h3 class="nomLocal">' + nomLocal + '</h3><br><h6 class="etage">' + level + '</h6><span class="codeLocalQ">Q' + numeroLocal + '</span><i class="material-icons pull-right">&#xE55E;</i></a></li>';
                }

                // Ajoute le très long string qui contient toute la liste dans la fenètre modale
                listeLocaux.append(elements);

                $("#containerResultatRecherche").toggle(false);

            }).complete(function () {
                /* console.log("TERMINER - Chargement des locaux dans la liste"); */
                pourcentageProgres += 17;
                progressBar.css("width", pourcentageProgres + "%");
                loadWaypoints(false);
            }); // $ajax

            loadWaypoints(false);

            $(".fermez").click(function () {
                $("#image360").hide();
                $(".fermez").hide();
            });

            $("#modalImage").on("shown.bs.modal", function() {
                if(PSV !== null) {
                    PSV.load();
                }
            });

            map.addLayer(pathLayer);
            map.addLayer(waypointLayer);

            $(".itineraire-menu").click(function () {
                $("#itineraire-title").html($(this).html() + " <span class=\"caret\">");
                $("#collapse1").collapse('toggle');
                $(".list-itineraire:not(" + "#" + $(this).attr("data-toggle") + ")").hide();

                $("#" + $(this).attr("data-toggle")).toggle();
                //$(this).
            });
        }); // ajax Complete(function(){})
