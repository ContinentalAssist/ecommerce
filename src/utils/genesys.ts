// src/utils/genesys.ts

declare global {
    interface Window {
      Genesys: any;
    }
  }

// src/utils/genesys.ts

export function initializeGenesys(deploymentId: string): void {
  
    window['Genesys'] = window['Genesys'] || function (...args: any[]) {
      (window['Genesys'].q = window['Genesys'].q || []).push(...args);
    };

  
    window['Genesys'].t = 1 * new Date().getTime();
    window['Genesys'].c = {
        environment: 'prod',
        deploymentId: deploymentId,
        debug: false         
      };
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://apps.mypurecloud.com/genesys-bootstrap/genesys.min.js';
    script.charset = 'utf-8';
    script.onload = () => {
      window['Genesys']
    };
    document.head.appendChild(script);
  
  }