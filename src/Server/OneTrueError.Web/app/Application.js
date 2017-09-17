/// <reference path="../Scripts/Models/AllModels.ts" />
/// <reference path="../Scripts/Griffin.Yo.d.ts" />
/// <reference path="../Scripts/CqsClient.ts" />
var OneTrueError;
(function (OneTrueError) {
    var Applications;
    (function (Applications) {
        var Yo = Griffin.Yo;
        var CqsClient = Griffin.Cqs.CqsClient;
        var MenuItem = (function () {
            function MenuItem() {
            }
            return MenuItem;
        }());
        Applications.MenuItem = MenuItem;
        var Navigation = (function () {
            function Navigation() {
            }
            Navigation.breadcrumbs = function (items) {
                var str = "<li class=\"breadcrumb-item\"><a href=\"#/\">Dashboard</a></li>";
                items.forEach(function (item) {
                    str += "<li class=\"breadcrumb-item\"><a href=\"#" + item.href + "\">" + item.title + "</a></li>";
                });
                $('#breadCrumbs').html(str);
            };
            Object.defineProperty(Navigation, "pageTitle", {
                set: function (name) {
                    $('#pageTitle').html(name);
                },
                enumerable: true,
                configurable: true
            });
            Navigation.setPageMenu = function (items) {
                var container = document.getElementById('pageMenu');
                container.innerHTML = '';
                if (name == null || items == null) {
                    return;
                }
                items.forEach(function (item) {
                    var i = document.createElement("i");
                    i.className = "fa fa-" + item.awesomeIcon;
                    var a = document.createElement('a');
                    a.className = "text-dark";
                    a.href = item.url;
                    a.setAttribute("data-title", item.title);
                    a.appendChild(i);
                    container.appendChild(a);
                    if (item.title) {
                        var aa = $(a);
                        aa.tooltip();
                    }
                });
            };
            return Navigation;
        }());
        Applications.Navigation = Navigation;
        var ApplicationService = (function () {
            function ApplicationService() {
            }
            //private static cache: ICache = new WindowCache();
            ApplicationService.prototype.get = function (applicationId) {
                var def = P.defer();
                var cacheItem = Yo.GlobalConfig
                    .applicationScope["application"];
                if (cacheItem && cacheItem.Id === applicationId) {
                    def.resolve(cacheItem);
                    return def.promise();
                }
                var query = new OneTrueError.Core.Applications.Queries.GetApplicationInfo();
                query.ApplicationId = applicationId;
                CqsClient.query(query)
                    .done(function (result) {
                    Yo.GlobalConfig.applicationScope["application"] = result;
                    def.resolve(result);
                });
                return def.promise();
            };
            return ApplicationService;
        }());
        Applications.ApplicationService = ApplicationService;
        var WindowCache = (function () {
            function WindowCache() {
                this.id = WindowCache.cacheCounter++;
                //window["OneTrueErrorCache"+this.id] = 
            }
            WindowCache.prototype.get = function (key) {
                return this.items[key];
            };
            WindowCache.prototype.set = function (key, value) {
                this.items[key] = value;
            };
            WindowCache.prototype.exists = function (key) {
                return this.items.hasOwnProperty(key);
            };
            return WindowCache;
        }());
        WindowCache.cacheCounter = 0;
        Applications.WindowCache = WindowCache;
    })(Applications = OneTrueError.Applications || (OneTrueError.Applications = {}));
})(OneTrueError || (OneTrueError = {}));
;
//# sourceMappingURL=Application.js.map