import React, { useEffect, useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import SettingsWindow from '../components/SettingsWindow';
import { Tab, Tabs, Link, Chip } from "@nextui-org/react";
import { CHECKOUT_URL } from '../components/LicenseKeyInput';

export default function Home() {

  const [ selectedTabKey, setSelectedTabKey ] = useState("chat");
  
  const [ queriesCount, setQueriesCount ] = useState(0);
  const fetchQueriesCount = () => {
    chrome.storage.local.get(null, function(items) {
      // Filter out openAiApiKey and licenseKey
      let filteredData = {};
      for (const key in items) {
        if (key !== "openAiApiKey" && key !== "licenseKey") {
          filteredData[key] = items[key];
        }
      }
      // Count user messages
      let count = 0;
      for (const key in filteredData) {
        const itemCount = Array.from(JSON.parse(filteredData[key])).filter(m => m.role === "user").length;
        count += itemCount
      }
      setQueriesCount(count);
    });
  }

  const [ apiKey, setApiKey ] = useState(null);
  const fetchApiKey = () => {
    chrome.storage.local.get(["openAiApiKey"]).then((result) => {
      if (result["openAiApiKey"]) {
        setApiKey(result["openAiApiKey"]);
      } else {
        setSelectedTabKey("settings");
      }
    })
  }

  const [ licenseKey, setLicenseKey ] = useState(null);
  const fetchLicenseKey = () => {
    chrome.storage.local.get(["licenseKey"]).then((result) => {
      if (result["licenseKey"]) {
        setLicenseKey(result["licenseKey"]);
      }
    })
  }

  useEffect(() => {
    fetchQueriesCount();
    fetchLicenseKey();
    fetchApiKey();
  }, [])

  return (
    <section className="w-full flex flex-col gap-4 pt-4">

      <div className="w-full flex items-center justify-between gap-4 px-6">

        <Tabs 
          radius="full" aria-label="Acess Tabs"
          selectedKey={selectedTabKey}
          onSelectionChange={(key) => setSelectedTabKey(key)}
        >
          <Tab 
            key="chat"
            title="Chat"
          />
          <Tab 
            key="settings"
            title="Settings"
          /> 
        </Tabs>

        {!licenseKey ? (
          <div className='w-full flex flex-col items-end'>
            <h3>{queriesCount}/20 free queries</h3>
            <Link href={CHECKOUT_URL} className='font-bold' isExternal showAnchorIcon>Go unlimited</Link>
          </div>
        ) : (
          <Chip variant="flat" color="success" radius="full">Unlimited</Chip>
        )}

      </div>

      { selectedTabKey === "chat" ? (
        <ChatWindow 
          fetchQueriesCount={fetchQueriesCount} 
          licenseKey={licenseKey}
          apiKey={apiKey}
          queriesCount={queriesCount}
        />
      ) : (
        <SettingsWindow
          licenseKey={licenseKey}
          fetchLicenseKey={fetchLicenseKey}
          apiKey={apiKey}
          fetchApiKey={fetchApiKey}
        />
      ) }

    </section>
  );
}
