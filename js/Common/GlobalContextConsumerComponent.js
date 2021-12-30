import React from 'react';
import {GlobalContext} from '../AppFrame';

// HOC to send global context to wrapped component in props
export function withContext(WrappedComponent) {
    class GlobalContextConsumerComponent extends React.Component {
        render = ()=> {
            let self = this;
            return (
                <GlobalContext.Consumer>
                    {function (context) {
                        return (
                            <WrappedComponent
                                ref={(c) => {
                                    self.wrappedComponent = c;
                                }}
                                context={context}
                                {...self.props}
                            />
                        );
                    }}
                </GlobalContext.Consumer>
            );
        }
    }

    return GlobalContextConsumerComponent;
}
