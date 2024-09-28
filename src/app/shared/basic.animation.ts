import { animate, group, state, style, transition, trigger } from "@angular/animations";

export class BasicAnimation {
  
    static SlideInOut(maxHeight: number, timeForOpacityToKickIn: number = 800) {
        return [
            trigger('slideInOut', [
                state('in', style({
                    'max-height': `${maxHeight}px`, 'opacity': '1', 'display': 'block'
                })),
                state('out', style({
                    'max-height': '0', 'opacity': '0', 'display': 'none'
                })),
                transition('in => out', [group([
                    animate('400ms ease-in-out', style({
                        'opacity': '0'
                    })),
                    animate('600ms ease-in-out', style({
                        'max-height': '0'
                    })),
                    animate('700ms ease-in-out', style({
                        'display': 'none'
                    }))
                ]
                )]),
                transition('out => in', [group([
                    animate('1ms ease-in-out', style({
                        'display': 'block'
                    })),
                    animate('600ms ease-in-out', style({
                        'max-height': `${maxHeight}px`
                    })),
                    animate(`${timeForOpacityToKickIn}ms ease-in-out`, style({
                        'opacity': '1'
                    }))
                ]
                )])
            ]),
        ];
    }
}