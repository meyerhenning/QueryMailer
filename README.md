# QueryMailer

QueryMailer is an Azure DevOps Extension that provides a task for sending WIQL query results via mail.
The task encapsulates the [Work Item Tracking / Send Mail](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/send-mail/send-mail?view=azure-devops-rest-7.1) functionality of the Azure DevOps Services REST API.

## Installation
Get it from the Visual Studio Marketplace: <br>
https://marketplace.visualstudio.com/items?itemName=HenningMeyer.querymailer

## Usage

```yml
steps:
- task: QueryMailer@0
  displayName: Send Query via Mail
  inputs:
    accessToken: $(creds.token)
    organization: 'FooOrganization'
    project: 'AmazingWebApp'
    subject: 'Work Item Selection'
    message: |
        Please take a look at the following work items.
    receivers: |
        90a41e6b-bab0-46ae-b1bb-0c2eb90432bc
        564555f3-f800-4c5b-b200-3f45670acfa5
        cd603395-24f7-41aa-b074-a1263df1bb4a
    wiql: 'select [System.Id] from Workitems'
```

| Parameter | Aliases | Required | Description
| - | - | - | - |
| accessToken | token | true | The Access Token used for API authorization |
| organization | org | true | The name of the Azure DevOps organization |
| project | proj | true | The name of the Azure DevOps project |
| subject | | true | The subject of the mail |
| message | msg | false | The message included in the mail |
| receivers | to | false | The tfIds of the users the mail get send to <br> Required if there is no value for **cc** provided |
| cc | | false | The tfIds of the users the mail copy get send to <br> Required if there is no value for **receivers** provided |
| wiql | | true | The [WIQL](https://learn.microsoft.com/en-us/azure/devops/boards/queries/wiql-syntax?view=azure-devops) query to process |

## Mail

Take a look at the screenshot at [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=HenningMeyer.querymailer) to see how the mail is formatted. <br>
The table contents are defined by the WIQL query.

## Notes
- The REST API functionality is currently limited to work with tfIds
- The mail is send by Azure DevOps Services
- The mail address of the token owner gets displayed in the mail
- Receivers need to have permissions to read the included work items

## Main Dependencies
- [Azure DevOps Client for Node.js](https://github.com/microsoft/azure-devops-node-api)
- [Azure DevOps Extension SDK](https://github.com/microsoft/azure-devops-extension-sdk)
- [Azure Pipelines Task Lib](https://github.com/microsoft/azure-pipelines-task-lib)
