import jquery from "jquery";
import i18n from "@/i18n";
import axios from "axios";
import Version from "@/module/Version";
import Package from "../../../package.json";
const $: any = jquery;
export default function () {
    window.newVersion = Version;
    axios.noCacheGet("/VERSION")
        .then(({ data }) => {
            const version = new Version(data);
            const currentVersion = new Version(Package.version);
            if (version.greaterThan(currentVersion)) {
                $("body")
                    .toast({
                        message: `${i18n.t("current version")}:${Package.version}<br>${i18n.t("server frontend version")}:${version.toString()}<br>`,
                        displayTime: 0,
                        title: i18n.t("web application update"),
                        position: "bottom right",
                        closeIcon: true,
                        classActions: "basic left",
                        actions: [{
                            text: i18n.t("update"),
                            class: "green",
                            click: function () {
                                location.reload();
                            }
                        }]
                    });
            }
        });
}
