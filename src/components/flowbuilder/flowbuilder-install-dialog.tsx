import { Dialog, DialogContent, DialogContentText, DialogTitle, Divider } from "@mui/material";
import { codepen, CopyBlock, dracula, github } from "react-code-blocks";
import { useFirestoreConnect } from "react-redux-firebase";
import { useAppSelector } from "../../app/hooks";


const code = ({apiKey} : {apiKey:string}) => {
  return ` import { OnboardOS, useOnboardOS } from 'onboard-os'
  const FlowPreview = () => {

        const onboardOs = useOnboardOS()

        const onValidate = async (stepId: string , stepType: string, data: object) => {
            onboardOs.goForward()
            return true
        }

        const onEnd = (data:object, schema:object) => {
        }

        const onAction = (stepId: string , stepType: string, data: object) => {

        }

        return (
            <div>
                <OnboardOS 
                  onAction={onAction} 
                  onEnd={onEnd} 
                  register={onboardOs.register} 
                  onValidate={onValidate} 
                  apiKey={\"${apiKey}\"} 
                />
            </div>
        )
    }
  `
}
export interface InstallDialogProps {
    open: boolean;
    onClose: () => void;
    flowId: string;
  }
  
  export const InstallDialog = (props: InstallDialogProps) => {
    const { onClose, open, flowId } = props;

    useFirestoreConnect([
      { collection: 'prod-flows', doc: flowId }
    ])
  
  
    const prodFlow = useAppSelector(
      ({ firestore }): any => firestore.data['prod-flows'] && firestore.data['prod-flows'][flowId]
    )
  
    const handleClose = () => {
      onClose();
    };
  
    const handleListItemClick = (value: string) => {
      onClose();
    };
  
    return (
      <Dialog  maxWidth="lg" onClose={handleClose} open={open}>
        <DialogTitle>Install Onboard OS</DialogTitle>
        <DialogContent>
          <DialogContentText>
           <p>1. Install <code>Onboard OS</code> via <code>yarn</code> or <code>npm</code></p>
          </DialogContentText>
          <pre><code class="lang-sh">yarn <span class="hljs-keyword">add</span><span class="bash"> onboard-os</span>
          </code></pre>
          <pre><code class="lang-sh">npm <span class="hljs-selector-tag">i</span> onboard-os
          </code></pre>

          <Divider sx={{paddingBottom: 2}}  />
          <DialogContentText sx={{paddingBottom: 2}}>
            <p>2. Import your signup flow to your app</p>
          </DialogContentText>
          <CopyBlock 
            text={code({apiKey: prodFlow.apiKey ?? ""})}
            language={"javascript"}
            showLineNumbers={false}
            theme={codepen}
            wrapLines
          />

        </DialogContent>
      </Dialog>
    );
  }