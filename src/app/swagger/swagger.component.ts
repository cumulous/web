import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';

import { ApiService } from '../api/api/api.service';

export const HideTopbarPlugin = () => ({
  components: {
    Topbar: () => null,
  },
});

@Component({
  templateUrl: './swagger.component.html',
})
export class SwaggerComponent implements AfterViewInit {
  @ViewChild('swaggerUi') private readonly dom: ElementRef;
  private ui: SwaggerUIBundle;

  constructor(private apiService: ApiService) {}

  ngAfterViewInit() {
    this.apiService.getApi().subscribe(spec => {
      this.setApiPath(spec);
      this.createUi(spec);
      this.authorizeUi();
    });
  }

  private setApiPath(spec) {
    const apiPath = this.apiService.configuration.basePath;
    const paths = apiPath.match(/^(https:\/\/([^\/]+))?(\/.*)/);
    spec['host'] = paths[2];
    spec['basePath'] = paths[3];
  }

  private createUi(spec) {
    this.ui = SwaggerUIBundle({
      spec,
      domNode: this.dom.nativeElement,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset,
      ],
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl,
        HideTopbarPlugin,
      ],
      layout: 'StandaloneLayout',
    });
  }

  private authorizeUi() {
    this.ui.authActions.authorize({
      member_token: {
        name: 'member_token',
        schema: {
          in: 'header',
          name: 'Authorization',
          type: 'apiKey',
        },
        value: this.apiService.configuration.apiKeys.Authorization,
      },
    });
  }
}
