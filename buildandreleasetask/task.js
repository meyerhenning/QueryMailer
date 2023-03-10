"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tasklib = __importStar(require("azure-pipelines-task-lib/task"));
const azapi = __importStar(require("azure-devops-node-api"));
function run() {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // required
            const token = (_a = tasklib.getInput("accessToken", true)) !== null && _a !== void 0 ? _a : "";
            const org = (_b = tasklib.getInput("organization", true)) !== null && _b !== void 0 ? _b : "";
            const project = (_c = tasklib.getInput("project", true)) !== null && _c !== void 0 ? _c : "";
            const subject = (_d = tasklib.getInput("subject", true)) !== null && _d !== void 0 ? _d : "";
            const wiql = (_e = tasklib.getInput("wiql", true)) !== null && _e !== void 0 ? _e : "";
            // optional
            const bodyMsg = tasklib.getInput("message", false);
            const receivers = tasklib.getInput("receivers", false);
            const cc = tasklib.getInput("cc", false);
            const orgUrl = `https://dev.azure.com/${org}`;
            if (typeof receivers === "undefined"
                && typeof cc === "undefined") {
                tasklib.setResult(tasklib.TaskResult.Failed, "There are no values for the parameters 'receivers' and 'cc' given. At least one of them has to be definied.");
                return;
            }
            console.log("✅ Provided values for all required parameters");
            let receiverList = [];
            let ccList = [];
            if (typeof receivers !== "undefined") {
                receiverList = receivers.split(/\r?\n/);
            }
            if (typeof cc !== "undefined") {
                ccList = cc.split(/\r?\n/);
            }
            let requestHandler = azapi.getPersonalAccessTokenHandler(token);
            let webApi = new azapi.WebApi(orgUrl, requestHandler);
            let trackingApi = yield webApi.getWorkItemTrackingApi();
            let msg = {
                body: bodyMsg,
                cC: {
                    tfIds: ccList
                },
                replyTo: {},
                subject: subject,
                to: {
                    tfIds: receiverList
                }
            };
            let body = {
                message: msg,
                wiql: wiql
            };
            yield trackingApi.sendMail(body, project)
                .then(res => {
                console.log("✅ Sent mail successfully");
                tasklib.setResult(tasklib.TaskResult.Succeeded, "Sent mail successfully");
            });
        }
        catch (err) {
            tasklib.setResult(tasklib.TaskResult.Failed, err.message);
        }
    });
}
run();
