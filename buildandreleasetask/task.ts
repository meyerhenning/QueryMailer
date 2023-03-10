import * as tasklib from "azure-pipelines-task-lib/task";
import * as azapi from "azure-devops-node-api";
import { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import { SendMailBody, MailMessage } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";

async function run() {
    try {
        // required
        const token = tasklib.getInput("accessToken", true) ?? "";
        const org = tasklib.getInput("organization", true) ?? "";
        const project = tasklib.getInput("project", true) ?? "";
        const subject = tasklib.getInput("subject", true) ?? "";
        const wiql = tasklib.getInput("wiql", true) ?? "";

        // optional
        const bodyMsg = tasklib.getInput("message", false)
        const receivers = tasklib.getInput("receivers", false);
        const cc = tasklib.getInput("cc", false);
        
        const orgUrl = `https://dev.azure.com/${org}`;

        if(typeof receivers === "undefined"
        && typeof cc === "undefined") {
            tasklib.setResult(tasklib.TaskResult.Failed, "There are no values for the parameters 'receivers' and 'cc' given. At least one of them has to be definied.");
            return;
        }

        console.log("✅ Provided values for all required parameters");

        let receiverList : string[] = [];
        let ccList : string[] = [];

        if(typeof receivers !== "undefined")
        {
            receiverList = receivers.split(/\r?\n/);
        }

        if(typeof cc !== "undefined")
        {
            ccList = cc.split(/\r?\n/);
        }

        let requestHandler : IRequestHandler = azapi.getPersonalAccessTokenHandler(token);
        let webApi : azapi.WebApi = new azapi.WebApi(orgUrl, requestHandler);

        let trackingApi = await webApi.getWorkItemTrackingApi();

        let msg : MailMessage = {
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

        let body : SendMailBody = {
            message: msg,
            wiql: wiql
        };

        await trackingApi.sendMail(body, project)
        .then(res => {
            console.log("✅ Sent mail successfully");
            tasklib.setResult(tasklib.TaskResult.Succeeded, "Sent mail successfully");
        });
    }
    catch (err: any) {
        tasklib.setResult(tasklib.TaskResult.Failed, err.message);
    }
}

run();