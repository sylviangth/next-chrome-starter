import { Button, Input, Link } from "@nextui-org/react";
import { useState, useEffect } from "react";
import axios from "axios";

export const CHECKOUT_URL = "https://mindpalspace.lemonsqueezy.com/checkout/buy/b71b4125-b28d-44fa-bfe1-4d6bded34b1c";
const STORE_ID = 26052;
const PRODUCT_ID = 119974; 

const activateLicenseKey = async (licenseKey) => {

  const url = 'https://api.lemonsqueezy.com/v1/licenses/activate';

  const data = {
    license_key: licenseKey,
    instance_name: 'Official'
  };

  const headers = {
    Accept: 'application/json'
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data

  } catch (error) {
    console.error(error);
  }

};


const LicenseKeyInput = ({ licenseKey, fetchLicenseKey }) => {

  const [ keyInput, setKeyInput ] = useState(licenseKey || "");
  const [ error, setError ] = useState(null);

  const handleInputKey = async () => {
    if (!keyInput || !keyInput.trim()) {
      setError("Invalid Lemon Squeezy License Key.");
      return;
    }
    try {
      const keyData = await activateLicenseKey(keyInput);
      if (!keyData || keyData.error) {
        setError("Invalid Lemon Squeezy License Key.");
        return;
      } else if (
        keyData.meta.store_id === STORE_ID && 
        keyData.activated == true &&
        keyData.meta.product_id === PRODUCT_ID
      ) {
        chrome.storage.local.set({ "licenseKey": keyInput }).then(() => {
          fetchLicenseKey();
        });
      } else {
        setError("Invalid license key. Please double-check your license key.");
        return;
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong while activating your license key.");
    }
  }

  return (
    <section className="w-full flex flex-col gap-4">
      { !licenseKey && (
        <div className="flex flex-col w-full gap-2">
          <div className="text-sm w-full flex items-center gap-2">
            <h3>
              Don&apos;t have a license key?
            </h3>
            <Link
              size="sm"
              isExternal
              href={CHECKOUT_URL}
              showAnchorIcon
              className="font-bold"
            >
              Buy one here
            </Link>
          </div>
          <div className="text-sm w-full flex items-center gap-2">
            <h3>
              Lost your license key?
            </h3>
            <Link
              size="sm"
              isExternal
              href="https://app.lemonsqueezy.com/my-orders/"
              showAnchorIcon
              className="font-bold"
            >
              Find it here
            </Link>
          </div>
        </div>
      )}
      {
        licenseKey ? (
          <div className="flex flex-col gap-4 w-full">
            <Input
              isDisabled
              type="text"
              label="Your license key"
              className="w-full" radius="sm"
              value={keyInput}
            />
            <div className="flex gap-2">
              <Button 
                size="md" radius="sm" color="primary" variant="flat"
                onClick={() => window.open("https://app.lemonsqueezy.com/my-orders/", "_blank")}
              >
                Manage
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            <Input
              type={"text"}
              label="Input a valid License key"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full" radius="sm"
            />
            <div className="flex gap-2">
              <Button 
                size="md" radius="sm" color="primary" variant="flat"
                disabled={!keyInput || !keyInput.trim()}
                onClick={() => void handleInputKey()}
              >
                Activate
              </Button>
            </div>
            {error && <p className="text-danger">{error}</p>}
          </div>
        )
      }
    </section>
  )
}

export default LicenseKeyInput;