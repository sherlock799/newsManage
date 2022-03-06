import { Editor } from "react-draft-wysiwyg";
import { convertToRaw,ContentState,EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import React,{useEffect, useState} from 'react';

export default function NewsEditor(props) {

  const [editorState, seteditorState] = useState('')

  useEffect(() => {
    const html = props.content
    if(html===undefined){return}
    const contentBlock = htmlToDraft(html)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      seteditorState(editorState)
    }
  }, [props.content])
  

  return (
    <div style={{height:'300px',border:'1px solid',overflow:"auto"}}>
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={seteditorState}
        onBlur={()=>{
          props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
        }}
      />
    </div>
  );
}
