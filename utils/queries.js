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


module.exports = { 
    occupiersAdditional, 
    occupiersResponsible,
    propertyHazards,
    propertyCertificates,
    periodTransactions,
    adhocCharges,
    recurringCharges
}