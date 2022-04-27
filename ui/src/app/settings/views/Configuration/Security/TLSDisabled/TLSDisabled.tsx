import {
  CodeSnippet,
  CodeSnippetBlockAppearance,
  Icon,
} from "@canonical/react-components";

const TLSDisabled = (): JSX.Element => {
  return (
    <>
      <p>
        <Icon name="warning" />
        <span className="u-nudge-right--small">TLS disabled</span>
      </p>
      <p>
        You can enable TLS with a certificate and a private key in the CLI with
        the following command:
      </p>
      <CodeSnippet
        blocks={[
          {
            appearance: CodeSnippetBlockAppearance.LINUX_PROMPT,
            code: "maas config-tls enable $key $cert --port YYYY",
          },
        ]}
      />
      <p>
        {/*
          TODO: Add docs links
          https://github.com/canonical-web-and-design/app-tribe/issues/829
        */}
        <a href="#todo">More about MAAS native TLS</a>
      </p>
    </>
  );
};

export default TLSDisabled;