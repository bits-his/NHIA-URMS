import * as React from "react";
import { type StateOfficeReportType } from "./constants";
import StateOfficeReportPage from "./StateOfficeReportPage";
import StateOfficeReportDetail from "./StateOfficeReportDetail";
import ExtendedReportDetail from "./ExtendedReportDetail";
import ComplaintsReportForm from "./ComplaintsReportForm";
import AccreditationReportForm from "./AccreditationReportForm";
import StakeholderReportForm from "./StakeholderReportForm";
import HmoSelectionReportForm from "./HmoSelectionReportForm";
import ChallengesReportForm from "./ChallengesReportForm";

const EXTENDED_DETAIL = new Set<StateOfficeReportType>([
  "complaints", "accreditation", "stakeholder", "hmo-selection", "challenges",
]);

const FORM_COMPONENTS: Partial<Record<StateOfficeReportType, React.ComponentType<any>>> = {
  enrolment: StateOfficeReportPage,
  migration: StateOfficeReportPage,
  cemonc: StateOfficeReportPage,
  complaints: ComplaintsReportForm,
  accreditation: AccreditationReportForm,
  stakeholder: StakeholderReportForm,
  "hmo-selection": HmoSelectionReportForm,
  challenges: ChallengesReportForm,
};

export function StateOfficeFormRouter(props: {
  reportType: StateOfficeReportType;
  reportId?: number | null;
  onBack: () => void;
  defaultZoneId?: string | null;
  defaultStateId?: string | null;
}) {
  const Form = FORM_COMPONENTS[props.reportType] ?? StateOfficeReportPage;
  return <Form {...props} />;
}

export function StateOfficeDetailRouter(props: {
  reportType: StateOfficeReportType;
  reportId: number;
  onBack: () => void;
  onEdit?: () => void;
}) {
  if (EXTENDED_DETAIL.has(props.reportType)) {
    return <ExtendedReportDetail {...props} />;
  }
  return <StateOfficeReportDetail {...props} />;
}
