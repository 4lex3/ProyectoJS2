export  function convertMarkdownToHTML(text) {

    text = text.replace(/^###### (.*?)$/gm, '<h6>$1</h6>');
    text = text.replace(/^##### (.*?)$/gm, '<h5>$1</h5>');
    text = text.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
    text = text.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    text = text.replace(/^\d+\.\s+(.*?)$/gm, '<ol><li>$1</li></ol>');
    
    text = text.replace(/^-\s+(.*?)$/gm, '<ul><li>$1</li></ul>');
    
    text = text.replace(/\n/g, '<br/>');

    return text;
}

