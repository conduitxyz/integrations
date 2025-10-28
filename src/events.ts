export const IntegrationEventStatusEnum = {
  NOT_INSTALLED: "NOT_INSTALLED",
  INSTALLING: "INSTALLING",
  INSTALLED: "INSTALLED",
  UNINSTALLING: "UNINSTALLING",
  FAILED_TO_INSTALL: "FAILED_TO_INSTALL",
  CONFIGURATION_REQUIRED: "CONFIGURATION_REQUIRED",
} as const;

export type IntegrationEventStatusEnum = typeof IntegrationEventStatusEnum;

export type IntegrationEventStatus =
  IntegrationEventStatusEnum[keyof IntegrationEventStatusEnum];

type IntegrationEventResponseBase = {
  /**
   * Testnet id.
   */
  id: string;
  /**
   * Status to update to internally, Integration.Status is used
   */
  status: IntegrationEventStatus;
};

type IntegrationEventResponseNotInstalled = IntegrationEventResponseBase & {
  /**
   * Status to update to internally, Integration.Status is used
   */
  status: IntegrationEventStatusEnum["NOT_INSTALLED"];
};

type IntegrationEventResponseInstalling = IntegrationEventResponseBase & {
  /**
   * Status to update to internally, Integration.Status is used
   */
  status: IntegrationEventStatusEnum["INSTALLING"];
  /**
   * Update ETA in seconds.
   */
  eta_seconds?: number;
};

type IntegrationEventResponseInstalled = IntegrationEventResponseBase & {
  /**
   * Status to update to internally, Integration.Status is used
   */
  status: IntegrationEventStatusEnum["INSTALLED"];
  /**
   * Manage url.
   */
  manage_integration_link?: string;
};

type IntegrationEventResponseUninstalling = IntegrationEventResponseBase & {
  /**
   * Status to update to internally, Integration.Status is used
   */
  status: IntegrationEventStatusEnum["UNINSTALLING"];
};

type IntegrationEventResponseConfigurationRequired =
  IntegrationEventResponseBase & {
    /**
     * Status to update to internally, Integration.Status is used
     */
    status: IntegrationEventStatusEnum["CONFIGURATION_REQUIRED"];
    /**
     * Configuration link to set.
     */
    configure_integration_link: string;
  };

type IntegrationEventResponseFailedToInstall = IntegrationEventResponseBase & {
  /**
   * Status to update to internally, Integration.Status is used
   */
  status: IntegrationEventStatusEnum["FAILED_TO_INSTALL"];
  /**
   * Failure reason.
   */
  failure_reason: string;
};

export type IntegrationEventResponse =
  | IntegrationEventResponseNotInstalled
  | IntegrationEventResponseInstalling
  | IntegrationEventResponseInstalled
  | IntegrationEventResponseUninstalling
  | IntegrationEventResponseConfigurationRequired
  | IntegrationEventResponseFailedToInstall;

export function constructIntegrationEventResponse(
  data: IntegrationEventResponse
) {
  return data;
}

export const IntegrationEventTypeEnum = {
  INSTALLED: "INSTALLED",
  UNINSTALLED: "UNINSTALLED",
  NETWORK_UPDATED: "NETWORK_UPDATED",
  NETWORK_DELETED: "NETWORK_DELETED",
} as const;

export type IntegrationEventTypeEnum = typeof IntegrationEventTypeEnum;

export type IntegrationEventType =
  IntegrationEventTypeEnum[keyof IntegrationEventTypeEnum];

export const IntegrationEventStackTypeEnum = {
  OPTIMISM: "OPTIMISM",
  ARBITRUM: "ARBITRUM",
} as const;

export type IntegrationEventStackTypeEnum =
  typeof IntegrationEventStackTypeEnum;

export const NetworkTypeEnum = {
  MAINNET: "MAINNET",
  TESTNET: "TESTNET",
} as const;

export type NetworkTypeEnum = typeof NetworkTypeEnum;

export type NetworkTypeEnumType = NetworkTypeEnum[keyof NetworkTypeEnum];

export type IntegrationEventStackType =
  IntegrationEventStackTypeEnum[keyof IntegrationEventStackTypeEnum];

export type NativeCurrency = {
  /**
   * Name of currency, I.E. Ether
   */
  name: string;
  /**
   * Symbol of currency, I.E. ETH
   */
  symbol: string;
  /**
   * Decimals of currency, I.E. 18
   */
  decimals: number;
  /**
   * Contract address of currency on the settlement layer, I.E. 0x...
   */
  contract: string;
};

type IntegrationEventBase = {
  event: IntegrationEventType;
  /**
   * A unique identifier for the network.
   */
  id: string;
  /**
   * Installation ID for the integration
   */
  installation_id: string;
};

type IntegrationEventInstalledBase = IntegrationEventBase & {
  event: IntegrationEventTypeEnum["INSTALLED"];
  /**
   * An identifier for the blockchain.
   */
  chain_id: number;
  /**
   * An identifier for the parent blockchain.
   */
  parent_chain_id: number;
  /**
   * Specifies the stack type.
   */
  type: IntegrationEventStackType;
  /**
   * Information about the native currency used in the network.
   */
  native_currency: NativeCurrency;
  /**
   *  The name of the network.
   */
  name: string;
  /**
   * The RPC endpoint URL for the network
   */
  rpc: string;
  /**
   * The WebSocket endpoint URL for the network
   */
  ws: string;
  /**
   * The URL of the blockchain explorer for the network.
   */
  explorer: string;
  /**
   * The URL of the network's logo
   */
  logo_url: string;
  /**
   * The URL of the network's icon
   */
  icon_url: string;
  /**
   * The brand color of the network.
   */
  brand_color: string;
  /**
   * A mapping of contract names to their respective addresses
   */
  contracts: { [key: string]: string };
  /**
   * Flag to determine if the network is private or not, used to inform partners to hide the network in their app
   */
  private: boolean;
  /**
   * Type of the network, testnet or mainnet
   */
  network_type: NetworkTypeEnumType;
};

type IntegrationEventInstalledOptimism = IntegrationEventInstalledBase & {
  /**
   * Specifies the stack type.
   */
  type: IntegrationEventStackTypeEnum["OPTIMISM"];
  /**
   * The file path for Optimism contracts
   */
  file_optimism_contracts: string;
  /**
   * The file path for the Optimism genesis file
   */
  file_optimism_genesis: string;
  /**
   * The file path for Optimism rollup configuration
   */
  file_optimism_rollup: string;
};

type IntegrationEventInstalledArbitrum = IntegrationEventInstalledBase & {
  /**
   * Specifies the stack type.
   */
  type: IntegrationEventStackTypeEnum["ARBITRUM"];
  /**
   * The file path for Arbitrum core contracts
   */
  file_arbitrum_core: string;
  /**
   * The file path for Arbitrum chain information
   */
  file_arbitrum_chaininfo: string;
};

type IntegrationEventInstalled =
  | IntegrationEventInstalledOptimism
  | IntegrationEventInstalledArbitrum;

type IntegrationEventNetworkUpdated = IntegrationEventBase & {
  event: IntegrationEventTypeEnum["NETWORK_UPDATED"];
  /**
   * The URL of the network's logo
   */
  logo_url: string;
  /**
   * The URL of the network's icon
   */
  icon_url: string;
  /**
   * The brand color of the network.
   */
  brand_color: string;
};

type IntegrationEventUninstalled = IntegrationEventBase & {
  event: IntegrationEventTypeEnum["UNINSTALLED"];
};

type IntegrationEventNetworkDeleted = IntegrationEventBase & {
  event: IntegrationEventTypeEnum["NETWORK_DELETED"];
};

export type IntegrationEvent =
  | IntegrationEventInstalled
  | IntegrationEventUninstalled
  | IntegrationEventNetworkUpdated
  | IntegrationEventNetworkDeleted;
