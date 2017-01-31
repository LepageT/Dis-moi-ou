        // Initialisation de quelques variables, pour régler certains problèmes en rapport avec leurs scope dans les fonctions
        var imageUrl,
            imageBounds = "",
            planEtage = "",
            lc = "",
            marqueurs = "",
            libelleEtage = "",
            iconesEtage = "",
            numeroLocauxEtage = "",
            marqueur = "",
            etageActuel = 1;
        var listeLocauxObj = [];

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

        // Geolocalisation de l'utilisateur
        /*lc = L.control.locate({
            position: 'topleft', // set the location of the control
            drawCircle: false, // controls whether a circle is drawn that shows the uncertainty about the location
            follow: false, // follow the user's location
            setView: true, // automatically sets the map view to the user's location, enabled if `follow` is true
            keepCurrentZoomLevel: true, // keep the current map zoom level when displaying the user's location. (if `false`, use maxZoom)
            stopFollowingOnDrag: true, // stop following when the map is dragged if `follow` is true (deprecated, see below)
            remainActive: false, // if true locate control remains active on click even if the user's location is in view.
            markerClass: L.circleMarker, // L.circleMarker or L.marker
            circleStyle: {}, // change the style of the circle around the user's location
            markerStyle: {},
            followCircleStyle: {}, // set difference for the style of the circle around the user's location while following
            followMarkerStyle: {},
            icon: 'fa fa-map-marker', // class for icon, fa-location-arrow or fa-map-marker
            iconLoading: 'fa fa-spinner fa-spin', // class for loading icon
            circlePadding: [0, 0], // padding around accuracy circle, value is passed to setBounds
            metric: true, // use metric or imperial units
            onLocationError: function (err) {
                alert("Impossible de déterminer votre position")
            }, // define an error callback function
            onLocationOutsideMapBounds: function (context) { // called when outside map boundaries
                alert("Impossible de déterminer votre position");
            },
            showPopup: false, // display a popup when the user click on the inner marker
            strings: {
                title: "Show me where I am", // title of the locate control
                metersUnit: "meters", // string for metric units
                feetUnit: "feet", // string for imperial units
                popup: "You are within {distance} {unit} from this point", // text to appear if user clicks on circle
                outsideMapBoundsMsg: "You seem located outside the boundaries of the map" // default message for onLocationOutsideMapBounds
            },
            locateOptions: {
                enableHighAccuracy: true
            } // define location options e.g enableHighAccuracy: true or maxZoom: 10
        });

        // Ajoute le poitn bleu sur la carte
        lc.addTo(map);

        // Démare le service de gélocalisation
        lc.start();*/

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

        // Fonction pour changer les plans des étages selon le besoin.
        function changerEtage(etage) {

            $("#indicateurEtage").text(etage);

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
            etageActuel = etage;

            if (etage == -1) {
                imageUrl = 'images/etages/etage0_locaux.svg';
                imageLocauxUrl = 'images/etages/etage0_numero.svg'
                iconesEtageUrl = 'images/etages/etage0_icones.svg';
                libelleEtageUrl = 'images/etages/etage0_libelle.svg';
            } else {
                imageUrl = 'images/etages/etage' + etage + '_locaux.svg';
                imageLocauxUrl = 'images/etages/etage' + etage + '_numero.svg'
                iconesEtageUrl = 'images/etages/etage' + etage + '_icones.svg';
                libelleEtageUrl = 'images/etages/etage' + etage + '_libelle.svg';
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

            // Affiche la carte en arrière-plan de tout les autres calque. Nécésaire pour voir le point de géolocalisation après avoir changer d'étage
            planEtage.bringToBack();
            afficheLorsZoom();
            map.panTo([46.8302871, -71.227337]);

        } // Fin fonction changerEtage()

        // Ca contenir la postion du marqueur en object javascript dans le format ---> [lat, long]
        var positionMarqueur = "";

        // Fonction appellé chaque fois que l'on veux afficher un marqueur sur la carte pour montrer l'emplacement d'un local
        function afficherMarqueur(position, etage, message, local, image) {

            // Suprime le calque "marqueur" qui contient le ou les marqueurs
            map.removeLayer(marqueur);

            // Transforme le string "postition" en objet pour être capable de l'afficher
            positionMarqueur = JSON.parse(position);

            // Affiche le bon étage selon le local
            changerEtage(etage);

            // Crée un marqueur et le fait rebondir selon les paramètres "duration" et "height"
            var button = '<button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalImage">Default</button>';

            marqueur = L.marker(positionMarqueur, {
                bounceOnAdd: true,
                bounceOnAddOptions: {
                    duration: 500,
                    height: 200
                }
            }).bindPopup(message + button);

            // Créé un nouveau calque, ajoute le marqueur puis l'affiche sur la carte
            map.addLayer(marqueur);

            //Ouvre le popup du marqueur automatiquement (Contient la variable "message" de la fonction afficheMarqueur())
            marqueur.openPopup();

            // Ferme la fênetre modale
            $('#modalRechercher').modal('hide')

            // Centre le marqueur dans l'écran
            map.panTo(positionMarqueur);

            // Modifie la source de l'image
            $('#imgModal').attr("src", "images/logo-dismoiou.png");

            //source pour titre message
            $('#labelMessage').html(message);

            //Afficher le path jusqu'au local
            var myPath = findPathForLocal(local);
            if (myPath !== null) {
                var temp = new Path(local, myPath);
                redrawPath(temp, positionMarqueur);
            }
        };

        function findPathForLocal(local) {
            for (var i = 0; i < listeLocauxObj.length; i++) {
                if (listeLocauxObj[i].local == local) {
                    return listeLocauxObj[i].path;
                }
            }

            return null;
        }
        
          $(document).ready(function () {
            $(".list-itineraire").hide();
            var cacheListe = $("#premier-jour");
            var cacheListe2 = $("#organisation");
            var cacheListe3 = $("#inscription-gym");
            var cacheListe4 = $("#parcoursCultu");

            $("#first-day").on("click", function () {
                cacheListe.toggle();
                cacheListe2.hide();
                cacheListe3.hide();
                cacheListe4.hide();

            });

            $("#organiScolaire").on("click", function () {
                cacheListe2.toggle();
                cacheListe.hide();
                cacheListe3.hide();
                cacheListe4.hide();
            });

            $("#gym").on("click", function () {
                cacheListe3.toggle();
                cacheListe.hide();
                cacheListe2.hide();
                cacheListe4.hide();
            });

            $("#parcours").on("click", function () {
                cacheListe4.toggle();
                cacheListe.hide();
                cacheListe2.hide();
                cacheListe3.hide();
            });
        });

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

                        $("#boutonLegende").click(function(event){
                            event.preventDefault();
                            $("#modalLegende").modal('show');
                        });

                 // Ouvre la fenêtre modale itineraire avec le bouton dans le menu de navigation
                        $("#boutonItineraire").click(function(event){
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
                    message;
                listeLocauxObj = data;
                /* console.info("Nombre de locaux à ajouter: " + data.length); */
                for (i = 0; i < data.length; i++) {
                    nomLocal = data[i].nom;
                    numeroLocal = data[i].local;
                    positionLocal = data[i].position;
                    etageLocal = data[i].etage;
                    message = data[i].message;
                    var level = '';

                    // Selon chaque étage
                    if (etageLocal == -1) {
                        level = 'Sous-sol';
                    } else if (etageLocal == 1) {
                        level = etageLocal + 'er étage';
                    } else {
                        level = etageLocal + 'e étage';
                    }

                    elements += '<li><a href=\"javascript:afficherMarqueur(\'' + positionLocal + '\'' + ',' + etageLocal + ',' + '\'<strong>' + nomLocal + '</strong><br>' + message + '\',' + numeroLocal + ')">' + '<h3 class="nomLocal">' + nomLocal + '</h3><br><h6 class="etage">' + level + '</h6><span class="codeLocalQ">Q' + numeroLocal + '</span><i class="material-icons pull-right">&#xE55E;</i></a></li>';
                }

                // Ajoute le très long string qui contient toute la liste dans la fenètre modale
                listeLocaux.append(elements);

                $("#containerResultatRecherche").toggle(false);

            }).complete(function () {
                /* console.log("TERMINER - Chargement des locaux dans la liste"); */
                pourcentageProgres += 17;
                progressBar.css("width", pourcentageProgres + "%");
            }); // $ajax

            // Calque avec les rue autour du Cégep
            var routesUrl = 'images/etages/routes.svg';
            var routesBounds = [[46.8274718, -71.2311092], [46.8333687, -71.2232114]];
            var routes = L.imageOverlay(routesUrl, routesBounds).addTo(map);
        }); // ajax Complete(function(){})
