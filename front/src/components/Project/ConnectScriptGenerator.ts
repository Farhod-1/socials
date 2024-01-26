export default function (token: string): string {
  const code = `<script src="${window.CALL24_CONFIG.WIDGET_URL}/connect.js?project=$TOKEN$"></script>`

  return code.replace('$TOKEN$', token)
}
