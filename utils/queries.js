const getAccountOccupancies = accountId => {
    return `
    <fetch>
        <entity name="pobl_occupancycontract" >
            <attribute name="pobl_occupancycontractreference" />
            <attribute name="pobl_occupancycontractid" />
            <attribute name="pobl_name" />
            <attribute name="pobl_occupantcontractstartdate" />
            <attribute name="statecodename" />
            <attribute name="pobl_occupantcontractenddate" />
            <filter>
            <condition attribute="statecode" operator="eq" value="0" />
            </filter>
            <filter>
            <condition attribute="pobl_accountid" operator="eq" value="${accountId}" />
            </filter>
            <link-entity name="pobl_property" from="pobl_propertyid" to="pobl_propertyreferenceid" link-type="inner" alias="prop" >
            <attribute name="pobl_addressconcat" />
            </link-entity>
        </entity>
    </fetch>
    `
}

const singleOccupancy = occupancyId => {
    return `<fetch>
        <entity name="pobl_occupancycontract" >
        <attribute name="pobl_occupancycontractid" />
        <attribute name="pobl_name" />
        <attribute name="pobl_occupancycontractreference" />
        <attribute name="pobl_occupantcontractstartdate" />
        <attribute name="pobl_occupancycontracttype" />
        <attribute name="pobl_contractbalance" />
        <attribute name="pobl_nextdebitcycledate" />
        <attribute name="pobl_occupantcontractenddate" />
        <attribute name="pobl_propertyreferenceid" />
        <filter>
            <condition attribute="pobl_occupancycontractid" operator="eq" value="${occupancyId}" />
        </filter>
        <link-entity name="pobl_property" from="pobl_propertyid" to="pobl_propertyreferenceid" link-type="inner" alias="property" >
            <attribute name="pobl_addressconcat" />
            <attribute name="pobl_accommodationtype" />
        </link-entity>
        </entity>
    </fetch>
    `
}

const occupiersResponsible = occupancyId => {
    return `<fetch distinct="true" >
        <entity name="contact" >
            <attribute name="contactid" />
            <attribute name="fullname" />
            <link-entity name="pobl_contact_pobl_occupancycontract_leadoccu" to="contactid" from="contactid" alias="L" link-type="outer" >
                <link-entity name="pobl_occupancycontract" to="pobl_occupancycontractid" from="pobl_occupancycontractid" alias="OCL" link-type="outer" />
            </link-entity>
            <filter>
                <condition entityname="OCL" attribute="pobl_occupancycontractid" operator="eq" value='${occupancyId}' />
            </filter>
        </entity>
    </fetch>`
}

const occupiersAdditional = occupancyId => {
    return `<fetch distinct="true" >
        <entity name="contact" >
            <attribute name="contactid" />
            <attribute name="fullname" />
            <link-entity name="pobl_contact_pobl_occupancycontract_addition" to="contactid" from="contactid" alias="A" link-type="outer" >
            <link-entity name="pobl_occupancycontract" to="pobl_occupancycontractid" from="pobl_occupancycontractid" alias="OCA" link-type="outer" />
            </link-entity>
            <filter>
                <condition entityname="OCA" attribute="pobl_occupancycontractid" operator="eq" value="${occupancyId}" />
            </filter>
        </entity>
    </fetch>`
}

const propertyHazards = propertyId => {
    return `<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
    <entity name="pobl_hazard">
      <attribute name="pobl_hazardid" />
      <attribute name="pobl_name" />
      <attribute name="pobl_hazardref" />
      <attribute name="pobl_hazardtype" />
      <attribute name="pobl_hazardstatus" />
      <attribute name="pobl_hazardimpact" />
      <attribute name="createdon" />
      <order attribute="pobl_name" descending="false" />
      <filter type="and">
        <condition attribute="pobl_hazardpropertyid" operator="eq" uitype="pobl_property" value="${propertyId}" />
        <condition attribute="pobl_hazardshowonportal" operator="eq" value="1" />
      </filter>
    </entity>
  </fetch>`
}

const propertyCertificates = propertyId => {
    return `<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
        <entity name="pobl_certificate">
        <attribute name="pobl_certificateid" />
        <attribute name="pobl_name" />
        <attribute name="createdon" />
        <attribute name="pobl_issueddate" />
        <attribute name="pobl_certificatetypeid" />
        <attribute name="pobl_certificatestart" />
        <attribute name="pobl_certificatereview" />
        <attribute name="pobl_certificateexpires" />
        <attribute name="pobl_certificatesupplier" />
        <attribute name="statecode" />
        <order attribute="pobl_name" descending="false" />
        <filter type="and">
            <condition attribute="pobl_propertyid" operator="eq" uitype="pobl_property" value="${propertyId}" />
            <condition attribute="pobl_certificateonportal" operator="eq" value="1" />
            <condition attribute="statecode" operator="eq" value="0" />
        </filter>
        </entity>
    </fetch>`
}

const periodTransactions = (occupancyId, start, end) => {
    return `
        <fetch>
            <entity name="pobl_debitperiodsummary" >
                <attribute name="pobl_contract_closingbal" />
                <attribute name="pobl_periodenddate" />
                <attribute name="pobl_perioddebitvalue" />
                <attribute name="pobl_periodstartdate" />
                <attribute name="pobl_periodcreditvalue" />
                <attribute name="pobl_debitperiodsummaryid" />
                <filter>
                    <condition attribute="pobl_debtperiodcontractid" operator="eq" value="${occupancyId}" />
                </filter>

                ${(start && end) ? `
                <filter>
                    <condition attribute="pobl_periodstartdate" operator="gt" value="{{start}}" />
                    <condition attribute="pobl_periodstartdate" operator="lt" value="{{end}}" />
                </filter>` 
                : null}

                <order attribute="pobl_periodstartdate" descending="true" />
                <link-entity name="pobl_transaction" from="pobl_debitperiodid" to="pobl_debitperiodsummaryid" alias="t" >
                    <attribute name="pobl_transactionnarrative" />
                    <attribute name="pobl_transactionvalue" />
                    <attribute name="pobl_contractbal" />
                    <attribute name="pobl_transactiontype" />
                    <attribute name="createdon" />
                    <order attribute="createdon" descending="true" />
                </link-entity>
            </entity>
        </fetch>
    `
}

const adhocCharges = occupancyId => {
    return `
    <fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
        <entity name="pobl_adhoccharge">
            <attribute name="pobl_adhocchargeid" />
            <attribute name="pobl_name" />
            <attribute name="pobl_adhocchargeref" />
            <attribute name="pobl_adhocchargevalue" />
            <attribute name="pobl_adhocchargetype" />
            <attribute name="pobl_adhocstage" />
            <attribute name="createdon" />
            <order attribute="pobl_name" descending="false" />
            <filter type="and">
            <condition attribute="pobl_contractid" operator="eq" uitype="pobl_occupancycontract" value="${occupancyId}" />
            </filter>
        </entity>
    </fetch>
    `
}

const recurringCharges = occupancyId => {
    return `
    <fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
        <entity name="pobl_recurringcharge">
            <attribute name="pobl_recurringchargeid" />
            <attribute name="pobl_recurringchargevalue" />
            <attribute name="pobl_recurringchargeref" />
            <attribute name="pobl_name" />
            <attribute name="pobl_recurringchargestartdate" />
            <attribute name="pobl_recurringchargeenddate" />
            <attribute name="pobl_recurringchargenextbillingdate" />
            <attribute name="createdon" />
            <order attribute="pobl_name" descending="false" />
            <filter type="and">
            <condition attribute="pobl_contractid" operator="eq" uitype="pobl_occupancycontract" value="${occupancyId}" />
            </filter>
        </entity>
    </fetch>
    `
}

const maintenanceTemplates = item => {
    return `
    <fetch>
        <entity name="pobl_mainttemplatecase" >
            <attribute name="pobl_mainttemplatecaseid" />
            <attribute name="pobl_maintcasetemplatename" />
            <attribute name="pobl_maintcasetemplateportaldescription" />
            <attribute name="pobl_maintcasetemplateservicecharged" />
            <attribute name="pobl_maintcasetemplaterecharge" />
            <attribute name="pobl_maintcasetemplateshowonportal" />
            <attribute name="pobl_locationinhome" />
            <attribute name="pobl_problemitem" />
            <attribute name="pobl_worktypeid" />
            <attribute name="pobl_priority" />
            <attribute name="pobl_slaid" />
            <attribute name="pobl_description" />
            <attribute name="pobl_contractid" />
            <attribute name="pobl_costcentreid" />
            <attribute name="pobl_activitycodeid" />
            <attribute name="pobl_vatcodeid" />
            <filter>
                <condition attribute="pobl_problemitemname" operator="eq" value="${item}" />
            </filter>
            <link-entity name="pobl_maintworktype" from="pobl_maintworktypeid" to="pobl_worktypeid" link-type="outer" alias="workTypeLink">
                <attribute name="pobl_maintworktypeid" />
            </link-entity>
            <link-entity name="sla" from="slaid" to="pobl_slaid" link-type="outer" alias="slaLink">
                <attribute name="slaid" />
            </link-entity>
            <link-entity name="pobl_vatcode" from="pobl_vatcodeid" to="pobl_vatcodeid" link-type="outer" alias="vatLink">
                <attribute name="pobl_vatcodeid" />
            </link-entity>
            <link-entity name="entitlement" from="entitlementid" to="pobl_contractid" link-type="outer" alias="contractLink">
                <attribute name="entitlementid" />
            </link-entity>
            <link-entity name="pobl_costcentre" from="pobl_costcentreid" to="pobl_costcentreid" link-type="outer" alias="costCentreLink">
                <attribute name="pobl_costcentreid" />
            </link-entity>
            <link-entity name="pobl_chartofactivities" from="pobl_chartofactivitiesid" to="pobl_activitycodeid" link-type="outer" alias="activityCodeLink">
                <attribute name="pobl_chartofactivitiesid" />
            </link-entity>
        </entity>
    </fetch>
    `
}

const templateJobs = templateId => {
    return `
    <fetch>
        <entity name="pobl_mainttemplatecase" >
            <attribute name="pobl_name" />
            <attribute name="pobl_jobelement1id" />
            <attribute name="pobl_jobelement1qty" />
            <attribute name="pobl_jobelement2id" />
            <attribute name="pobl_jobelement2qty" />
            <attribute name="pobl_jobelement3id" />
            <attribute name="pobl_jobelement3qty" />
            <attribute name="pobl_jobelement4id" />
            <attribute name="pobl_jobelement4qty" />
            <attribute name="pobl_jobelement5id" />
            <attribute name="pobl_jobelement5qty" />
            <attribute name="pobl_jobelement6id" />
            <attribute name="pobl_jobelement6qty" />
            <attribute name="pobl_jobelement7id" />
            <attribute name="pobl_jobelement7qty" />
            <attribute name="pobl_jobelement8id" />
            <attribute name="pobl_jobelement8qty" />
            <attribute name="pobl_jobelement9id" />
            <attribute name="pobl_jobelement9qty" />
            <attribute name="pobl_jobelement10id" />
            <attribute name="pobl_jobelement10qty" />
            <filter>
            <condition attribute="pobl_mainttemplatecaseid" operator="eq" value="${templateId}" />
            </filter>
            <link-entity name="product" from="productid" to="pobl_jobelement1id" link-type="outer" alias="jobelement1Link" >
            <attribute name="productid" />
            <attribute name="name" />
            </link-entity>
            <link-entity name="product" from="productid" to="pobl_jobelement2id" link-type="outer" alias="jobelement2Link" >
            <attribute name="productid" />
            <attribute name="name" />
            </link-entity>
            <link-entity name="product" from="productid" to="pobl_jobelement3id" link-type="outer" alias="jobelement3Link" >
            <attribute name="productid" />
            </link-entity>
            <link-entity name="product" from="productid" to="pobl_jobelement4id" link-type="outer" alias="jobelement4Link" >
            <attribute name="productid" />
            </link-entity>
            <link-entity name="product" from="productid" to="pobl_jobelement5id" link-type="outer" alias="jobelement5Link" >
            <attribute name="productid" />
            </link-entity>
            <link-entity name="product" from="productid" to="pobl_jobelement6id" link-type="outer" alias="jobelement6Link" >
            <attribute name="productid" />
            </link-entity>
            <link-entity name="product" from="productid" to="pobl_jobelement7id" link-type="outer" alias="jobelement7Link" >
            <attribute name="productid" />
            </link-entity>
            <link-entity name="product" from="productid" to="pobl_jobelement8id" link-type="outer" alias="jobelement8Link" >
            <attribute name="productid" />
            </link-entity>
            <link-entity name="product" from="productid" to="pobl_jobelement9id" link-type="outer" alias="jobelement9Link" >
            <attribute name="productid" />
            </link-entity>
            <link-entity name="product" from="productid" to="pobl_jobelement10id" link-type="outer" alias="jobelement10Link" >
            <attribute name="productid" />
            </link-entity>
        </entity>
    </fetch>
    `
}

const propertyCode = propertyId => {
    return `
    <fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
    <entity name="pobl_property">
        <attribute name="pobl_propertyname" />
        <attribute name="pobl_propertyid" />
        <order attribute="pobl_propertyreference" descending="false" />
        <filter type="and">
        <condition attribute="pobl_propertyid" operator="eq" uitype="pobl_property" value="${propertyId}" />
        </filter>
        <link-entity name="pobl_propertyscheme" from="pobl_propertyschemeid" to="pobl_propertyschemeid" link-type="inner" alias="schemeLink">
        <attribute name="pobl_financecode" />
        </link-entity>
    </entity>
    </fetch>
    `
}

const projectCode = financeCode => {
    return `
    <fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
    <entity name="pobl_chartofcodes">
        <attribute name="pobl_chartofcodesid" />
        <attribute name="pobl_name" />
        <attribute name="createdon" />
        <order attribute="pobl_name" descending="false" />
        <filter type="and">
        <condition attribute="pobl_chartcode" operator="eq" value="${financeCode}" />
        </filter>
    </entity>
    </fetch>
    `
}

const contractorInfo = contractId => {
    return `
    <fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
    <entity name="entitlement">
        <attribute name="name" />
        <attribute name="createdon" />
        <attribute name="entitytype" />
        <attribute name="entitlementid" />
        <attribute name="pobl_supplier" />
        <attribute name="pobl_defaultpricelistid" />
        <attribute name="pobl_contractinterfacetype" />
        <order attribute="name" descending="false" />
        <filter type="and">
        <condition attribute="entitlementid" operator="eq" uitype="entitlement" value="${contractId}" />
        </filter>
        <link-entity name="competitor" from="competitorid" to="pobl_supplier" link-type="inner" alias="supplierLink">
        <attribute name="competitorid" />
        </link-entity>
        <link-entity name="pricelevel" from="pricelevelid" to="pobl_defaultpricelistid" link-type="inner" alias="priceListLink">
        <attribute name="pricelevelid" />
        </link-entity>
    </entity>
    </fetch>
    `
}

const flowSettings = name => {
    return `
    <fetch>
    <entity name="pobl_settingsregister" >
        <attribute name="pobl_attr1" />
        <attribute name="pobl_group" />
        <attribute name="pobl_name" />
        <filter>
        <condition attribute="pobl_group" operator="eq" value="Flow HTTP URL" />
        <condition attribute="pobl_name" operator="like" value="%${name}%" />
        </filter>
    </entity>
    </fetch>
    `
}

const maintJobSingle = id => {
    return `
    <fetch>
    <entity name="salesorder" >
        <attribute name="pobl_maintenanceworktypeid" />
        <attribute name="ordernumber" />
        <attribute name="customerid" />
        <attribute name="pobl_maintenancecaseid" />
        <attribute name="description" />
        <attribute name="pobl_propertyid" />
        <attribute name="pobl_contract" />
        <attribute name="pobl_costcentre" />
        <attribute name="pobl_accessdetails" />
        <attribute name="pobl_activitycode" />
        <attribute name="pobl_projectcodeid" />
        <attribute name="pobl_supplier" />
        <attribute name="pricelevelid" />
        <filter>
        <condition attribute="salesorderid" operator="eq" value="${id}" />
        </filter>
        <link-entity name="pobl_property" from="pobl_propertyid" to="pobl_propertyid" link-type="outer" alias="propertyLink">
        <attribute name="pobl_propertyid" />
        </link-entity>
    </entity>
    </fetch>
    `
}

const appointmentOutcome = value => {
    return `
    <fetch>
    <entity name="pobl_maintjobappointmentoutcome" >
        <attribute name="pobl_maintjobappointmentoutcomeid" />
        <attribute name="pobl_name" />
        <filter>
        <condition attribute="pobl_name" operator="eq" value="${value}" />
        </filter>
    </entity>
    </fetch>
    `
}

const checkExistingContact = obj => {
    const { firstname, lastname, dob, nationalInsurance } = obj

    return `
    <fetch>
        <entity name="contact" >
            <attribute name="contactid" />
            <attribute name="pobl_accountid" />
            <filter type="and" >
            <condition attribute="firstname" operator="eq" value="${firstname}" />
            <condition attribute="lastname" operator="eq" value="${lastname}" />
            <condition attribute="pobl_dob" operator="eq" value="${dob}" />
            <condition attribute="pobl_nationalinsurance" operator="eq" value="${nationalInsurance}" />
            </filter>
        </entity>
    </fetch>
    `
}


module.exports = { 
    singleOccupancy,
    occupiersAdditional, 
    occupiersResponsible,
    propertyHazards,
    propertyCertificates,
    periodTransactions,
    adhocCharges,
    recurringCharges,
    maintenanceTemplates,
    templateJobs,
    propertyCode,
    projectCode,
    contractorInfo,
    flowSettings,
    maintJobSingle,
    appointmentOutcome,
    checkExistingContact,
    getAccountOccupancies
}