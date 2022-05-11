/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import PageHeader from "../components/PageHaeder";

import { useState } from "react";
import { ethers } from "ethers";
import { create, create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import Image from "next/image";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

const PageHeaderText = {
  linkText: "Home",
  heading: "Create NFT",
};

const CreateNft = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (e) {
      console.log(e);
    }
  }

  async function CreateItem() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      createSale(url);
    } catch (error) {
      console.log("Error uploading files: ", error);
    }
  }

  async function createSale(url) {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();

    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(formInput.price, "ether");

    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    router.push("/");
  }

  return (
    <div>
      <PageHeader text={PageHeaderText} />
      <section className="create-nft-section padding-bottom padding-top">
        <div className="container">
          <div className="section-wrapper">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="create-nft py-5 px-4">
                  <div className="create-nft-form">
                    <div className="upload-item mb-30">
                      <p>PNG,JPG,JPEG,SVG,WEBP,Mp3 & Mp4 (Max-150mb)</p>
                      <div className="custom-upload">
                        <div className="file-btn">
                          <i className="icofont-upload-alt"></i>
                          Upload a file
                        </div>
                        <input
                          type="file"
                          name="Asset"
                          className="my-4"
                          onChange={onChange}
                        />
                        {fileUrl && (
                          <img
                            // className="rounded mt-4"
                            // width="350"
                            src={fileUrl}
                          />
                        )}
                        {/* <input type="file" /> */}
                      </div>
                    </div>
                    <div className="form-floating item-name-field mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="itemNameInput"
                        placeholder="Item Name"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            name: e.target.value,
                          })
                        }
                      />
                      <label>Item Name</label>
                    </div>

                    <div className="form-floating item-desc-field mb-30">
                      <textarea
                        className="form-control"
                        placeholder="Item Description"
                        id="itemDesc"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            description: e.target.value,
                          })
                        }
                      ></textarea>
                      <label>Item Description</label>
                    </div>

                    {/* <div className="item-category-field mb-30">
                      <h4>Select Item Catergory</h4>
                      <ul className="item-cat-list d-flex flex-wrap">
                        <li className="item-cat-btn active">
                          <span>
                            <i className="icofont-vector-path"></i>
                          </span>
                          Art
                        </li>
                        <li className="item-cat-btn">
                          <span>
                            <i className="icofont-penalty-card"></i>
                          </span>
                          Cards
                        </li>
                        <li className="item-cat-btn">
                          <span>
                            <i className="icofont-ui-game"></i>
                          </span>
                          Gaming
                        </li>
                        <li className="item-cat-btn">
                          <span>
                            <i className="icofont-music-disk"></i>
                          </span>
                          Music
                        </li>

                        <li className="item-cat-btn">
                          <span>
                            <i className="icofont-twitter"></i>
                          </span>
                          Tweets
                        </li>
                        <li className="item-cat-btn">
                          <span>
                            <i className="icofont-bill"></i>
                          </span>
                          Rare Item
                        </li>
                        <li className="item-cat-btn">
                          <span>
                            <i className="icofont-box"></i>
                          </span>{" "}
                          Collectibles
                        </li>
                        <li className="item-cat-btn">
                          <span>
                            <i className="icofont-gift"></i>
                          </span>
                          NFT Gifts
                        </li>
                      </ul>
                    </div> */}

                    <div className="item-price-field mb-3">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-floating">
                            <select
                              className="form-select"
                              id="selectCrypto"
                              aria-label="Floating label select"
                            >
                              <option>Ethereum</option>
                              {/* <option value="1">BitCoin</option> */}
                              <option value="1">Solana</option>
                              <option value="2">Polygon</option>
                              {/* <option value="2">Dollar</option> */}
                              {/* <option value="3">Pound</option> */}
                            </select>
                            <label>Select Currency</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control"
                              id="itemPriceInput"
                              placeholder="Item Price"
                              onChange={(e) =>
                                updateFormInput({
                                  ...formInput,
                                  price: e.target.value,
                                })
                              }
                            />
                            <label>Item Price</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="item-price-field mb-5">
                      <div className="row g-3 justify-content-center">
                        <div className="col-md-6 col-lg-4">
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control"
                              id="royalityInput"
                              placeholder="Royalities"
                            />
                            <label>Royalities</label>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control"
                              id="sizeInput"
                              placeholder="Size"
                            />
                            <label>Size</label>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control"
                              id="itemNumbersInput"
                              placeholder="Number of Copies"
                            />
                            <label>Number of Copies</label>
                          </div>
                        </div>
                      </div>
                    </div> */}

                    <div className="submit-btn-field text-center">
                      <button onClick={CreateItem}>Create Item</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreateNft;
