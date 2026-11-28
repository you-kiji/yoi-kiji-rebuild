"use client";
export function CookieSettingsButton(){return <button type="button" className="cookie-settings-button" onClick={()=>window.dispatchEvent(new Event("yoikiji-consent-settings"))}>Cookie settings</button>}
