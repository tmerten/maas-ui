import { Icon, Textarea } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import TLSEnabledFields from "./TLSEnabledFields";

import CertificateMetadata from "app/base/components/CertificateMetadata";
import FormikForm from "app/base/components/FormikForm";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";
import { TLSExpiryNotificationInterval } from "app/store/config/types";
import { tlsCertificate as tlsCertificateSelectors } from "app/store/general/selectors";

export type TLSEnabledValues = {
  notificationEnabled: boolean;
  notificationInterval: number;
};

export enum Labels {
  NotificationCheckbox = "Notify the certificate is due to expire in...",
  Interval = "Days",
  Textarea = "TLS certificate",
}

const INTERVAL_RANGE_ERROR = `Notification interval must be between ${TLSExpiryNotificationInterval.MIN} and ${TLSExpiryNotificationInterval.MAX} days.`;

const TLSEnabledSchema = Yup.object()
  .shape({
    notificationEnabled: Yup.boolean(),
    notificationInterval: Yup.number()
      .min(TLSExpiryNotificationInterval.MIN, INTERVAL_RANGE_ERROR)
      .max(TLSExpiryNotificationInterval.MAX, INTERVAL_RANGE_ERROR),
  })
  .defined();

const TLSEnabled = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const notificationEnabled = useSelector(
    configSelectors.tlsCertExpirationNotificationEnabled
  );
  const notificationInterval = useSelector(
    configSelectors.tlsCertExpirationNotificationInterval
  );
  const tlsCertificate = useSelector(tlsCertificateSelectors.get);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  if (!tlsCertificate) {
    return null;
  }

  return (
    <>
      <p>
        <Icon name="lock-locked-active" />
        <span className="u-nudge-right--small">TLS enabled</span>
      </p>
      <CertificateMetadata
        metadata={{
          CN: tlsCertificate.CN,
          expiration: tlsCertificate.expiration,
          fingerprint: tlsCertificate.fingerprint,
        }}
      />
      <Textarea
        aria-label={Labels.Textarea}
        className="p-textarea--readonly"
        readOnly
        rows={5}
        value={tlsCertificate.certificate}
      />
      <FormikForm<TLSEnabledValues>
        buttonsAlign="left"
        buttonsBordered={false}
        cleanup={configActions.cleanup}
        initialValues={{
          notificationEnabled: notificationEnabled || false,
          notificationInterval: notificationInterval || 30,
        }}
        onSaveAnalytics={{
          action: "Saved",
          category: "Storage settings",
          label: "Storage form",
        }}
        onSubmit={(values, { resetForm }) => {
          const { notificationEnabled, notificationInterval } = values;
          dispatch(configActions.cleanup());
          dispatch(
            configActions.update({
              tls_cert_expiration_notification_enabled: notificationEnabled,
              tls_cert_expiration_notification_interval: notificationInterval,
            })
          );
          resetForm({ values });
        }}
        saving={saving}
        saved={saved}
        validationSchema={TLSEnabledSchema}
      >
        <TLSEnabledFields />
      </FormikForm>
    </>
  );
};

export default TLSEnabled;