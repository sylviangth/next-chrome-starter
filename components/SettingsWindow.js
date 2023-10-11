import { Accordion, AccordionItem } from "@nextui-org/react";
import { useState, useEffect } from "react";
import OpenAiApiKeyInput from "./OpenAiApiKeyInput";
import LicenseKeyInput from "./LicenseKeyInput";

const SettingsWindow = ({ licenseKey, fetchLicenseKey, apiKey, fetchApiKey }) => {

  const sectionList = [
    {
      name: "License key",
      available: licenseKey ? true : false,
      availableText: "Licensed",
      unavailableText: "Unlicensed",
      optional: true,
      helpText: "A license key is not required for free trial but will be required to unlock unlimited usage.",
      content: <LicenseKeyInput licenseKey={licenseKey} fetchLicenseKey={fetchLicenseKey} />
    },
    {
      name: "OpenAI API key",
      available: apiKey ? true : false,
      availableText: "Active",
      unavailableText: "Missing",
      optional: false,
      helpText: "An OpenAI API key is required to power your usage.",
      content: <OpenAiApiKeyInput apiKey={apiKey} fetchApiKey={fetchApiKey} />
    },
  ]

  return (
    <section className="px-6 flex flex-col gap-4 w-full h-[32rem] overflow-hidden overflow-y-auto">
      {!apiKey && (
        <p className="text-center w-full px-4 py-2.5 rounded-md text-sm text-warning-600 bg-warning-100">
          Ready to explore Mindie? Just pop in your OpenAI API key below!
        </p>
      )}
      {apiKey && !licenseKey && (
        <p className="text-center w-full px-4 py-2.5 rounded-md text-sm text-warning-600 bg-warning-100">
          As a free user, you have a limit of 20 queries. Time to buy a license key and enjoy unlimited usage!
        </p>
      )}
      <Accordion 
        showDivider
        className="p-0 m-0 w-full flex flex-col gap-x-12"
        selectionMode="single"
        itemClasses={{ 
          base: "m-0 py-0 w-full",
          trigger: "m-0 px-4 py-2 duration-300 data-[hover=true]:bg-default-200 rounded-lg flex items-center",
          title: "font-bold text-base data-[open=true]:text-primary",
          content: "data-[open=true]:border-l-2 data-[open=true]:border-primary px-4 pb-4"
        }}
      >
        { sectionList.map((s, idx) => (
          <AccordionItem 
            key={`${idx}`} aria-label={`Accordion ${idx}`} 
            className="my-2"
            title={`${s.name} (${s.optional ? "Optional" : "Required"})`}
            subtitle={s.helpText}
            startContent={
              s.available ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="fill-success bi bi-check-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className={`${s.optional ? "fill-warning" : "fill-danger"} bi bi-exclamation-circle-fill`} viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
              )
            }
          >
            {s.content}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

export default SettingsWindow;