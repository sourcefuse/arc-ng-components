# ai-assistant

The ai-assistant library is a versatile and intelligent solution designed to seamlessly integrate AI-powered question-answering capabilities into Angular applications. This modular component allows developers to connect with configured AI models, enabling users to submit queries and receive AI-generated responses effortlessly.


## Angular version support

This version of the library requires Angular 22.

| Library version | Angular | Node.js |
| --- | --- | --- |
| 0.2.0 and later | 22 | ^22.22.3, ^24.15.0 or >=26 |
| 0.1.x | 14 | Angular 14 requirements |

If you are upgrading from 0.1.x, see [Upgrading from 0.1.x](#upgrading-from-01x).

##  Structure

The Structure of the ai-assistant-lib is as follows
```
|────ai-assistant-lib
│        ├── src
│             ├── assets
|                    ├── icons
|                    ├── images
|                    ├── styles
│             ├── lib
│                    |── components
|                    |── constants
|                    |── enums
|                    |── interfaces
|                    |── models
|                    |── pipes
|                    |── services
|                    |── types
|        |──(...other files)
```

## Installation
To install the ai-assistant module, use npm:

```bash
npm install @sourceloop/ai-assistant-client
```

The library expects these Angular packages in your app (all version 22):

```bash
npm install @angular/core@22 @angular/common@22 @angular/cdk@22 @angular/elements@22 @angular/material@22
```

`@angular/material` is not listed as a peer dependency, but the assistant uses Material dialogs, chips, tooltips and icons, so your app needs it.

## Components

### co-pilot-message-actions

- The co-pilot-message-actions component enables users to provide feedback on AI-generated responses by voting up or down. This feature helps improve the AI assistant’s performance by gathering user preferences and enhancing response quality over time. The component is designed for seamless integration and can be customized to align with specific user experience requirements


### co-pilot-image

- The co-pilot-image component allows the display of images within AI-generated responses. This component enhances user interaction by providing visual context alongside text-based outputs.

- It also offers interactive features such as image zooming, allowing users to closely examine details within the images

### co-pilot-video

- The co-pilot-video component enables the integration of video content within AI-generated responses. This feature enhances user engagement by providing dynamic visual information alongside textual interactions.

- It also offers essential playback controls, such as play and pause functionalities, allowing users to manage video content effectively. 

### co-pilot-related-topics

- The co-pilot-related-topics component enhances user engagement by suggesting additional subjects pertinent to the current conversation. This feature encourages deeper exploration and understanding by presenting users with a curated list of related topics, fostering a more comprehensive and interactive experience.

## Usage
To integrate the AI Assistant into your Angular application, follow these steps:

- Create a New Angular Application: If you haven't already, utilize the Angular CLI to generate a new Angular project. 

- Incorporate the AiAssistantModule into your application by importing it into your root module. Open the app.module.ts file and add the module to the imports array:

Here's an example of how your module might look after importing and configuring the AI Assistant:

ts
```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { XComponent } from './x/x.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AiAssistantModule } from '@sourceloop/ai-assistant-client';
@NgModule({
  declarations: [AppComponent, XComponent],
  imports: [
    BrowserModule,
    AiAssistantModule,  // Import AiAssistantModule
    HttpClientModule,
    ReactiveFormsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

The library components are NgModule based (`standalone: false`), so import `AiAssistantModule` as shown, including in standalone apps (add it to the `imports` of the component that opens the assistant, or to `importProvidersFrom` in `bootstrapApplication`). It works with both zoneless apps (the Angular 22 default) and apps that use zone.js.

- Import the icon font in your global `styles.scss`:

```scss
@import '../node_modules/@sourceloop/ai-assistant-client/src/assets/icons/icomoon/style.css';
```

- Copy the library images into your app's assets in `angular.json` (build options), so icons such as the related-topics icon load:

```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  {
    "glob": "**/*",
    "input": "node_modules/@sourceloop/ai-assistant-client/src/assets",
    "output": "assets"
  }
]
```

- Open the assistant in a Material dialog:

```ts
this.dialogRef = this.dialog.open(CoPilotComponent, {
  position: {top: '51.2px', right: '0px'},
  minHeight: '73vh',
  hasBackdrop: false,
  closeOnNavigation: false,
  disableClose: false,
  data: {sseUrl: environment.sseUrl},
});
```

- If you want the dialog without its default background and shadow, set the Material dialog tokens in your global styles:

```scss
.mat-mdc-dialog-container {
  --mat-dialog-container-color: transparent;
  --mat-dialog-container-elevation-shadow: none;
}
```

## Upgrading from 0.1.x

0.1.x was built for Angular 14. Moving to 0.2.0 or later:

- Upgrade your app to Angular 22, including `@angular/material` and `@angular/cdk`.
- Use Node.js ^22.22.3, ^24.15.0 or >=26.
- Material dialogs no longer use the `.mat-dialog-container` class. If your styles target it, switch to `.mat-mdc-dialog-container` and the dialog tokens shown above.
- The downvote feedback chips now use Material's `mat-chip-set`. They are styled to match the old look, with small size differences.
- The public API is unchanged: `AiAssistantModule`, `CoPilotComponent`, the selectors, inputs and outputs work as before.

## Implementing new component in ai-assistant

To integrate a new component (e.g., a widget or related topics) into the AI Assistant, follow these steps:

- Create the Component

     - Navigate to src/lib/components/ and create a new component.

     - Ensure the component includes the necessary .scss, .ts, and .html files.

     - Set the encapsulation mode to ViewEncapsulation.ShadowDom to maintain style isolation.

     - Match the other components: set `standalone: false` and `changeDetection: ChangeDetectionStrategy.Eager`, and declare the component in `AiAssistantModule`.

     - Set any state the template reads before the first render (in the constructor or `ngOnInit`), not in `ngAfterViewInit`. If a timer or callback changes template state later, inject `ChangeDetectorRef` and call `markForCheck()`, because zoneless apps don't re-render on timers.

- Define the Component Selector

     - After that add this component selector as a constant in src/lib/constants/custom-element-selector.constant.ts

     - Add the component selector as a constant in src/lib/constants/custom-element-selector.constant.ts:

        ts
         ```
          export const CoPilotDemo = 'ai-co-pilot-demo';
         ```
- Register the Component in the Module
     
     - Update src/lib/ai-assistant.module.ts to register the new component as a custom element:
        ts
         ```
         const demoElement = createCustomElement(
             CoPilotDemoComponent,
             {
               injector: this.injector,
             },
            );
           customElements.get(CoPilotDemoComponent) ||
           customElements.define(CoPilotDemoComponent,demoElement);  
         ```
- Integrate the Component into the AI Assistant Modal         
    - Modify co-pilot.component.ts to include the component dynamically:
      ts
        ```
        signals.onResponse({
        html: `<${CoPilotDemo} input='${data}'></${CoPilotDemo}>`,
        role: CoPilotRoles.AI,
         });
       ```
      The input attribute represents the data passed to the Angular component.
By following these steps, you can efficiently add new components to the AI Assistant while maintaining consistency and modularity.
## Configuration
To use the ai-assistant component, you will need to provide certain configuration parameters, such as the SSE URL. This configuration should be set in your environment settings.
Example configuration in your environment.ts:
ts
```
export const environment = {
  sseUrl: 'https://your-api-url.com/ai',  // URL for the AI service
};
``` 
## Request Payload
The default payload sent to the SSE (Server-Sent Events) URL is structured as follows:
{
    "prompt": "user's current request prompt",
    "previousQuestion": "previous question asked",
    "previousResponse": "previous response from AI service"
}
## Structure of SSE API
It is expected your structure of SSE API to be <br/>
```
{
    "chunk": "{{anytype here}}",
    "type": "{{ChunkTypes}}"
}

```
## Event Handling
Upon successful configuration, the AI Assistant component will commence receiving events via Server-Sent Events (SSE). These events are transmitted in discrete segments, each potentially encompassing various data types, including but not limited to:
- Image: An image provided by the AI service.
- Video: A video provided by the AI service.
- Related Topics: Suggestions for topics pertinent to the user's current context.
- Feature: Notifications regarding unsupported features or limitations specific to certain tenants.
Each event type is associated with a specific component responsible for rendering the appropriate content:
- Image Events: Activate the ImageComponent to display the received image.
- Video Events: Activate the VideoComponent to display the received video.
This event-driven architecture ensures that each event is processed according to its type, thereby delivering accurate information or media to the user in a timely manner.
Once your configuration is in place, the component will begin receiving events in chunks. These events may contain various types of data, including but not limited to:
You can get more info on ChunkTypes from `/ai-assistant/projects/ai-assistant-lib/src/lib/components`