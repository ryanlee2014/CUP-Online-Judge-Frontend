import { notUndefinedOrNull } from "../store/util/index";

const $ = require("jquery");
const jQuery = $;
window.jQuery = window.$ = $;
require("../../semantic/semantic-ui/semantic.min");
function binding_method(homepage, finished) {
    // fix menu when passed
    if ($(".fixed.menu").html()) {
        $(".masthead")
            .visibility({
                once: false,
                onBottomPassed: function () {
                    // $('.following.bar').addClass('light fixed');
                    $(".fixed.menu").transition("fade in");
                    //('.network.menu').addClass('secondary')
                    //$('.network.menu').removeClass('inverted');
                },
                onBottomPassedReverse: function () {
                    // $('.following.bar').removeClass('light fixed')
                    $(".fixed.menu").transition("fade out");
                    // $('.network.menu').removeClass('secondary');
                    // $('.network.menu').addClass('inverted');
                }
            })
        ;
    }

    // create sidebar and attach to menu open
    if ($(".ui.sidebar.mobile").html()) {
        $(".ui.sidebar.mobile")
            .sidebar("attach events", ".toc.item")
        ;
    }

    function lightin () {
        $(".following.bar").addClass("light fixed");
        $(".fixed.menu").transition("fade in");
        //$('.network.menu').addClass('secondary')
        if (typeof homepage === "boolean" && homepage && finished) {
            $(".network.menu").removeClass("inverted");
        }
    }

    function lightout () {
        $(".following.bar").removeClass("light fixed");
        $(".fixed.menu").transition("fade out");
        //('.network.menu').removeClass('secondary');
        if (typeof homepage === "boolean" && homepage && finished) {
            $(".network.menu").addClass("inverted");
        }
    }

    lightout();

    $("body")
        .visibility({
            once: false,
            offset: -10,
            observeChanges: false,
            continuous: false,
            refreshOnLoad: true,
            refreshOnResize: true,
            onTopPassedReverse: lightout,
            onTopPassed: lightin
        });
    $(".message .close")
        .off("click")
        .on("click", function () {
            $(this)
                .closest(".message")
                .transition("fade")
            ;
        });

}

export default {
    detectIP: function (tmp) {
        let ip;
        if (tmp.ip && !tmp.intranet_ip) {
            tmp.intranet_ip = tmp.ip;
        }
        if (tmp.intranet_ip) {
            if (tmp.intranet_ip.trim().match(/202\.204\.193\.[0-9]{1,3}/)) {
                let temp = tmp.intranet_ip;
                tmp.intranet_ip = tmp.ip || "";
                if (tmp.intranet_ip.match(/10\.10\.[0-9]{2}\.[0-9]{1,3}/)) {
                    tmp.place = "润杰有线";
                }
                else if (tmp.intranet_ip === "10.200.25.101" && tmp.intranet_ip.match(/10\.200\.25\.1[0-9]{2}/) || tmp.intranet_ip === "10.200.25.200") {
                    tmp.place = "403机房";
                }
                else if (tmp.intranet_ip.match(/10\.200\.26\./)) {
                    let ip = tmp.intranet_ip.substring(tmp.intranet_ip.lastIndexOf(".") + 1);
                    if (parseInt(ip) <= 100) {
                        tmp.place = "404机房";
                    }
                    else {
                        tmp.place = "405机房";
                    }
                }
                else if (tmp.intranet_ip.match(/10\.200\.28\.[0-9]{1,3}/) || tmp.intranet_ip.match(/10\.200\.26\.[0-9]{1,3}/)
                    || tmp.intranet_ip.match(/10\.200\.25\.[0-9]{1,3}/) || tmp.intranet_ip.match(/10\.200\.27\.[0-9]{1,3}/)) {
                    if (tmp.intranet_ip.match(/10\.200\.26\.[0-9]{1,3}/)) {
                        tmp.place = "405机房";
                    }
                    else if (tmp.intranet_ip.match(/10\.200\.28\.[0-9]{1,3}/)) {
                        ip = tmp.intranet_ip.substring(tmp.intranet_ip.lastIndexOf(".") + 1);
                        if (parseInt(ip) <= 80) {
                            tmp.place = "502机房";
                        }
                        else if (parseInt(ip) === 81) {
                            tmp.place = "502教师机";
                        }
                        else if (parseInt(ip) < 172 && parseInt(ip) >= 101) {
                            tmp.place = "503机房";
                        }
                        else {
                            tmp.place = "机房";
                        }
                    }
                    else if (tmp.intranet_ip.match(/10\.200\.27\.[0-9]{1,3}/)) {
                        ip = tmp.intranet_ip.substring(tmp.intranet_ip.lastIndexOf(".") + 1);
                        ip = parseInt(ip);
                        if (ip >= 1 && ip <= 102) {
                            tmp.place = "504机房";
                        }
                        else if (ip === 217) {
                            tmp.place = "504机房教师机";
                        }
                        else {
                            tmp.place = "机房";
                        }
                    }
                    else {
                        tmp.place = "机房";
                    }
                }
                else if (tmp.intranet_ip.match(/10\.1[1-2]{1}0\.[0-9]{1,3}\.[0-9]{1,3}/)) {
                    tmp.place = "Wi-Fi";
                }
                else if (tmp.intranet_ip.match(/10\.102\.[0-9]{1,3}\.[0-9]{1,3}/) || tmp.intranet_ip.match(/10\.120\.[0-9]{1,3}\.[0-9]{1,3}/)) {
                    tmp.place = "Wi-Fi";
                }
                else if (tmp.intranet_ip.match(/10\.105\.[0-9]{1,3}\.[0-9]{1,3}/)) {
                    tmp.place = "Wi-Fi";
                }
                else if (tmp.intranet_ip.match(/10\.103\.[0-9]{1,3}\.[0-9]{1,3}/)) {
                    tmp.place = "Wi-Fi";
                }
                else if (tmp.intranet_ip.match(/10\.116\.[0-9]{1,3}\.[0-9]{1,3}/)) {
                    tmp.place = "Wi-Fi";
                }
                else if (tmp.intranet_ip.match(/10\.1[0-9]{2}\.[0-9]{1,3}\.[0-9]{1,3}/)) {
                    tmp.place = "Wi-Fi";
                }
                else if (tmp.intranet_ip.match(/172\.16\.[\s\S]+/)) {
                    tmp.place = "VPN";
                }
                else if (tmp.intranet_ip.match(/2001:[\s\S]+/)) {
                    tmp.place = "IPv6";
                }
                else if (tmp.intranet_ip.match(/10\.3\.[\s\S]+/)) {
                    tmp.place = "地质楼";
                }
                else if (tmp.intranet_ip.match(/10\.200\.32\.[0-9]{1,3}/)) {
                    tmp.place = "润杰机房五楼";
                }
                else if (tmp.intranet_ip.match(/10\.200\.33\.[0-9]{1,3}/)) {
                    tmp.place = "润杰机房六楼";
                }
                else {
                    tmp.place = "未知";
                }
                tmp.intranet_ip = temp;
            }
            else {
                if (tmp.intranet_ip.match(/10\.10\.[0-9]{2}\.[0-9]{1,3}/)) {
                    tmp.place = "润杰有线";
                }
                else if (tmp.intranet_ip.match(/10\.200\.28\.[0-9]{1,3}/) || tmp.intranet_ip.match(/10\.200\.26\.[0-9]{1,3}/)
                    || tmp.intranet_ip.match(/10\.200\.25\.[0-9]{1,3}/) || tmp.intranet_ip.match(/10\.200\.27\.[0-9]{1,3}/)) {
                    if (tmp.intranet_ip.match(/10\.200\.26\.[0-9]{1,3}/)) {
                        tmp.place = "405机房";
                    }
                    else if (tmp.intranet_ip.match(/10\.200\.28\.[0-9]{1,3}/)) {
                        ip = tmp.intranet_ip.substring(tmp.intranet_ip.lastIndexOf(".") + 1);
                        if (parseInt(ip) <= 80) {
                            tmp.place = "502机房";
                        }
                        else if (parseInt(ip) < 172 && parseInt(ip) >= 101) {
                            tmp.place = "503机房";
                        }
                        else {
                            tmp.place = "机房";
                        }
                    }
                    else if (tmp.intranet_ip.match(/10\.200\.27\.[0-9]{1,3}/)) {
                        ip = tmp.intranet_ip.substring(tmp.intranet_ip.lastIndexOf(".") + 1);
                        ip = parseInt(ip);
                        if (ip >= 1 && ip <= 102) {
                            tmp.place = "504机房";
                        }
                        else if (ip === 217) {
                            tmp.place = "504机房教师机";
                        }
                        else {
                            tmp.place = "机房";
                        }
                    }
                    else {
                        tmp.place = "机房";
                    }
                }
                else if (tmp.intranet_ip.match(/10\.1[1-2]{1}0\.[0-9]{1,3}\.[0-9]{1,3}/)) {
                    tmp.place = "Wi-Fi";
                }
                else if (tmp.intranet_ip.match(/10\.116\.[0-9]{1,3}\.[0-9]{1,3}/)) {
                    tmp.place = "Wi-Fi";
                }
                else if (tmp.intranet_ip.match(/10\.102\.[0-9]{1,3}\.[0-9]{1,3}/) || tmp.intranet_ip.match(/10\.120\.[0-9]{1,3}\.[0-9]{1,3}/)) {
                    tmp.place = "Wi-Fi";
                }
                else if (tmp.intranet_ip.match(/10\.105\.[0-9]{1,3}\.[0-9]{1,3}/)) {
                    tmp.place = "Wi-Fi";
                }
                else if (tmp.intranet_ip.match(/10\.103\.[0-9]{1,3}\.[0-9]{1,3}/)) {
                    tmp.place = "Wi-Fi";
                }
                else if (tmp.intranet_ip.match(/10\.1[0-9]{2}\.[0-9]{1,3}\.[0-9]{1,3}/)) {
                    tmp.place = "Wi-Fi";
                }
                else if (tmp.intranet_ip.match(/172\.16\.[\s\S]+/)) {
                    tmp.place = "VPN";
                }
                else if (tmp.intranet_ip.match(/10\.200\.32\.[0-9]{1,3}/)) {
                    tmp.place = "润杰机房五楼";
                }
                else if (tmp.intranet_ip.match(/10\.200\.33\.[0-9]{1,3}/)) {
                    tmp.place = "润杰机房六楼";
                }
                else if (tmp.intranet_ip.match(/2001:[\s\S]+/) && tmp.ip && !tmp.ip.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/)) {
                    tmp.place = "IPv6";
                }
                else if (tmp.intranet_ip && tmp.ip && tmp.intranet_ip != tmp.ip) {
                    tmp.place = "外网";
                }
                else if (tmp.intranet_ip.match(/10\.3\.[\s\S]+/)) {
                    tmp.place = "地质楼";
                }
                else {
                    tmp.place = "未知";
                }
            }
        }
        else {
            tmp.place = "未知";
        }
        return tmp.place;
    },
    init: function (homepage, finished) {
        $("body, html").animate({ scrollTop: 0 }, 0);
        jQuery.event.special.touchstart = {
            setup: function (_, ns, handle) {
                if (ns.includes("noPreventDefault")) {
                    this.addEventListener("touchstart", handle, { passive: false });
                }
                else {
                    this.addEventListener("touchstart", handle, { passive: true });
                }
            }
        };
        window.chartColors = {
            red: "rgb(255, 99, 132)",
            orange: "rgb(255, 159, 64)",
            yellow: "rgb(255, 205, 86)",
            green: "rgb(75, 192, 192)",
            blue: "rgb(54, 162, 235)",
            purple: "rgb(153, 102, 255)",
            grey: "rgb(201, 203, 207)"
        };

        (function (global) {
            let Months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ];

            let COLORS = [
                "#4dc9f6",
                "#f67019",
                "#f53794",
                "#537bc4",
                "#acc236",
                "#166a8f",
                "#00a950",
                "#58595b",
                "#8549ba"
            ];

            let Samples = global.Samples || (global.Samples = {});
            let Color = global.Color;

            Samples.utils = {
                // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
                srand: function (seed) {
                    this._seed = seed;
                },

                rand: function (min, max) {
                    let seed = this._seed;
                    min = min === undefined ? 0 : min;
                    max = max === undefined ? 1 : max;
                    this._seed = (seed * 9301 + 49297) % 233280;
                    return min + (this._seed / 233280) * (max - min);
                },

                numbers: function (config) {
                    let cfg = config || {};
                    let min = cfg.min || 0;
                    let max = cfg.max || 1;
                    let from = cfg.from || [];
                    let count = cfg.count || 8;
                    let decimals = cfg.decimals || 8;
                    let continuity = cfg.continuity || 1;
                    let dfactor = Math.pow(10, decimals) || 0;
                    let data = [];
                    let i, value;

                    for (i = 0; i < count; ++i) {
                        value = (from[i] || 0) + this.rand(min, max);
                        if (this.rand() <= continuity) {
                            data.push(Math.round(dfactor * value) / dfactor);
                        }
                        else {
                            data.push(null);
                        }
                    }

                    return data;
                },

                labels: function (config) {
                    let cfg = config || {};
                    let min = cfg.min || 0;
                    let max = cfg.max || 100;
                    let count = cfg.count || 8;
                    let step = (max - min) / count;
                    let decimals = cfg.decimals || 8;
                    let dfactor = Math.pow(10, decimals) || 0;
                    let prefix = cfg.prefix || "";
                    let values = [];
                    let i;

                    for (i = min; i < max; i += step) {
                        values.push(prefix + Math.round(dfactor * i) / dfactor);
                    }

                    return values;
                },

                months: function (config) {
                    let cfg = config || {};
                    let count = cfg.count || 12;
                    let section = cfg.section;
                    let values = [];
                    let i, value;

                    for (i = 0; i < count; ++i) {
                        value = Months[Math.ceil(i) % 12];
                        values.push(value.substring(0, section));
                    }

                    return values;
                },

                color: function (index) {
                    return COLORS[index % COLORS.length];
                },

                transparentize: function (color, opacity) {
                    let alpha = opacity === undefined ? 0.5 : 1 - opacity;
                    return Color(color).alpha(alpha).rgbString();
                }
            };

            // DEPRECATED
            window.randomScalingFactor = function () {
                return Math.round(Samples.utils.rand(-100, 100));
            };
            // INITIALIZATION
            Samples.utils.srand(Date.now());

        }(window));
        // TODO: modify notie
        if (navigator.userAgent.indexOf("MSIE") !== -1) {
            location.href = "notie.php";
        }
        binding_method(homepage, finished);
        this.bindDropdown();
    },
    bindDropdown: function () {
        if ($(".ui.accordion").html()) {
            $(".ui.accordion")
                .accordion({
                    "exclusive": false
                })
            ;
        }
        if ($(".ui.menu .ui.dropdown").html()) {
            $(".ui.menu .ui.dropdown").dropdown({
                on: "hover",
                onShow: function () {
                    if ($(".following.bar").length > 1) {
                        $(".topmenu").css({
                            zIndex: 999
                        });
                    }
                },
                onHide: function () {
                    if ($(".following.bar").length > 1) {
                        $(".topmenu").css({
                            zIndex: 99
                        });
                    }
                }
            });
        }

        if ($(".ui.search.dropdown").html()) {
            $(".ui.search.dropdown").dropdown({
                on: "hover"
            });
        }
        if ($(".ui.dropdown.selection")) {
            $(".ui.dropdown.selection").dropdown({
                on: "hover"
            });
        }
        $(".message .close")
            .off("click")
            .on("click", function () {
                $(this)
                    .closest(".message")
                    .transition("fade")
                ;
            });
        $(".detail").popup({
            exclusive: true
            , hoverable: true,
            popup: ".flowing.popup.dropdown_menu_group"
        });
    },
    initToTopButton: function () {
        (function (a) {
            a.fn.scrollToTop = function (c) {
                let d = { speed: 800 };
                c && a.extend(d, { speed: c });
                return this.each(function () {
                    let b = a(this);
                    a(window).scroll(function () {
                        100 < a(this).scrollTop() ? b.fadeIn() : b.fadeOut();
                    });
                    b.click(function (b) {
                        b.preventDefault();
                        a("body, html").animate({ scrollTop: 0 }, d.speed);
                    });
                });
            };
        })(jQuery);
        $(document).ready(() => {
            $(function () {
                setTimeout(function () {
                    $("body").prepend("<a href=\"#top\" id=\"toTop\" style=\"z-index:999\"><i class=\"arrow alternate huge circle up icon\"></i></a>");
                    $("#toTop").scrollToTop();
                }, 50);
            });
        });
    },
    getAvatarURL (state) {
        const hasAvatar = !!state.avatar;
        const avatarUrl = typeof state.avatarUrl === "string" ? state.avatarUrl.trim() : "";
        if (hasAvatar && avatarUrl.length === 0) {
            return `/avatar/${state.user_id}.jpg`;
        }
        else if (avatarUrl.length > 0) {
            return avatarUrl;
        }
        else {
            return "/image/default-user.png";
        }
    },
    hasAvatarURL (state) {
        const hasAvatar = !!state.avatar;
        const avatarUrl = typeof state.avatarUrl === "string" ? state.avatarUrl.trim() : "";
        if (hasAvatar && avatarUrl.length === 0) {
            return true;
        }
        else {
            return avatarUrl.length > 0;
        }
    },
    stringify (target) {
        if (notUndefinedOrNull(target)) {
            return target + "";
        }
        else {
            return "";
        }
    }
};
