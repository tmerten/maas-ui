import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { test } from "vitest";

import KernelParametersForm, {
  Labels as FormLabels,
} from "./KernelParametersForm";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  screen,
  render,
  renderWithBrowserRouter,
  userEvent,
  waitFor,
} from "@/testing/utils";

const kernelCrashDumpEnabled =
  process.env.VITE_APP_KERNEL_CRASH_DUMP_ENABLED === "true";

const mockStore = configureStore();

describe("KernelParametersForm", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = factory.rootState({
      config: factory.configState({
        items: [
          {
            name: ConfigNames.KERNEL_OPTS,
            value: "foo",
          },
        ],
      }),
    });
  });

  it("sets kernel_opts value", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <KernelParametersForm />
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("textbox", {
        name: FormLabels.GlobalBootParams,
      })
    ).toHaveValue("foo");
  });

  it("dispatches an action to update the kernel_opts value", async () => {
    const state = { ...initialState };
    const store = mockStore(state);

    renderWithBrowserRouter(<KernelParametersForm />, { store });

    await userEvent.clear(
      screen.getByRole("textbox", { name: FormLabels.GlobalBootParams })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: FormLabels.GlobalBootParams }),
      "bar"
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(
      store.getActions().find((action) => action.type === "config/update")
    ).toStrictEqual({
      meta: {
        method: "bulk_update",
        model: "config",
      },
      type: "config/update",
      payload: {
        params: {
          items: {
            kernel_opts: "bar",
          },
        },
      },
    });
  });

  test.runIf(kernelCrashDumpEnabled)(
    "shows a tooltip for minimum OS requirements",
    async () => {
      renderWithBrowserRouter(<KernelParametersForm />, {
        state: { ...initialState },
      });

      await userEvent.hover(
        screen.getAllByRole("button", { name: "help-mid-dark" })[1]
      );

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveTextContent(
          "Ubuntu 24.04 LTS or higher."
        );
      });
    }
  );

  test.runIf(kernelCrashDumpEnabled)(
    "shows a tooltip for minimum hardware requirements",
    async () => {
      renderWithBrowserRouter(<KernelParametersForm />, {
        state: { ...initialState },
      });

      await userEvent.hover(
        screen.getAllByRole("button", { name: "help-mid-dark" })[0]
      );

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveTextContent(
          ">= 4 CPU threads, >= 6GB RAM, Reserve >5x RAM size as free disk space in /var."
        );
      });
    }
  );
});
