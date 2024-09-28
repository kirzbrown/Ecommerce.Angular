
import { ElementRef } from '@angular/core';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';


export interface Node {
    name: string;
    children?: Node[];
}

@Injectable()
export default class Utils {
    constructor() { }
   
    static buildTree(list: Node[], groupBy: string): Node[] {
        const groups = new Map<string, Node[]>();
        for (const item of list) {
            const group = item[groupBy];
            if (!groups.has(group)) {
                groups.set(group, []);
            }
            groups.get(group).push(item);
        }
    
        const tree: Node[] = [];
        for (const [group, items] of groups) {
            tree.push({
                name: group,
                children: Utils.buildTree(items, groupBy)
            });
        }
        return tree;
    }

    static genericTypeArrayToStringOfIds(idPropertyName: string, list: any[]): string[] {
        if (!!!idPropertyName || !!!list) return [];

        let stringIdArray: string[] = [];

        list.forEach(item => {
            stringIdArray.push(item[idPropertyName]);
        });

        return stringIdArray;
    }

    static getRouteParam(route: ActivatedRoute, routeParameterName: string): string {
        return route.snapshot.paramMap.get(routeParameterName);
    }
   
    static updateFormGroup(group: FormGroup, jsonValues: any): void {
        if (!!!group || !!!jsonValues) return null;

        for (let key in jsonValues) {
            if (jsonValues.hasOwnProperty(key)) {
                let formControl = group.get(key);
                if (formControl) {
                    try {
                        formControl.setValue(jsonValues[key]);
                    } catch (error) {
                        let dummy = null;
                    }
                }
            }
        }
    }

    static updateObject(destination: any, source: any): void {
        if (!!!destination || !!!source) return null;
        for (let key in source) {
            if (source.hasOwnProperty(key) && destination.hasOwnProperty(key)) {
                try {
                    destination[key] = source[key];
                } catch (error) {
                    let dummy = null;
                }
            }
        }
    }

    static isArraysEqual(a: any[], b: any[]): boolean {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
        return a.every(val => b.includes(val));
      }
   
    

    static capitalizeWord(s: string): string {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    /// https://stackoverflow.com/a/901144/1035039
    static getQueryString(name: string, url?: string) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    static scrollToTop(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    static generateGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static accessJsonbyString(o, s): any {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    }

    /// https://stackoverflow.com/a/38929456/1035039
    static getElementWidth(elementRef: string): number {
        let contentBody = document.querySelector(elementRef);

        let cs = window.getComputedStyle(contentBody);

        let paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        // var paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

        let borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
        // var borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

        // Element width and height minus padding and border
        return contentBody.clientWidth - paddingX - borderX;
        // elementHeight = contentBody.offsetHeight - paddingY - borderY;
    }   
  

    static b64toBlob(b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
    
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
    
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
    
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
    
        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
      }
    
    
   

}
