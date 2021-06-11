import bootResourceSelectors from "./selectors";

import {
  bootResourceState as bootResourceStateFactory,
  bootResourceStatuses as bootResourceStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("bootresource selectors", () => {
  it("can get all statuses", () => {
    const statuses = bootResourceStatusesFactory({
      polling: true,
    });
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses,
      }),
    });
    expect(bootResourceSelectors.statuses(state)).toStrictEqual(statuses);
  });

  it("can get the deletingImage status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          deletingImage: true,
        }),
      }),
    });
    expect(bootResourceSelectors.deletingImage(state)).toBe(true);
  });

  it("can get the fetching status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          fetching: true,
        }),
      }),
    });
    expect(bootResourceSelectors.fetching(state)).toBe(true);
  });

  it("can get the polling status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          polling: true,
        }),
      }),
    });
    expect(bootResourceSelectors.polling(state)).toBe(true);
  });

  it("can get the savingOther status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          savingOther: true,
        }),
      }),
    });
    expect(bootResourceSelectors.savingOther(state)).toBe(true);
  });

  it("can get the savingUbuntu status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          savingUbuntu: true,
        }),
      }),
    });
    expect(bootResourceSelectors.savingUbuntu(state)).toBe(true);
  });

  it("can get the savingUbuntuCore status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          savingUbuntuCore: true,
        }),
      }),
    });
    expect(bootResourceSelectors.savingUbuntuCore(state)).toBe(true);
  });

  it("can get the stoppingImport status", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          stoppingImport: true,
        }),
      }),
    });
    expect(bootResourceSelectors.stoppingImport(state)).toBe(true);
  });
});
