import { it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import StartMenu from "./StartMenu.vue";

const meinButtonErsatz = {
  props: ["disabled"],
  template: '<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>'
};

it("titel wird angezeigt", () => {
  // komponente einmal hochfahren zum testen
  const wrapper = mount(StartMenu, {
    global: { stubs: { "b-button": meinButtonErsatz } }
  });

  // guck ob im h1 wirklich der richtige text steht
  expect(wrapper.find("h1").text()).toBe("AktionsTag26");
});

it("button ist disabled wenn kein name eingegeben wurde", () => {
  const wrapper = mount(StartMenu, {
    global: { stubs: { "b-button": meinButtonErsatz } }
  });

  // erster button = der host button
  const button = wrapper.findAll("button")[0];
  // sollte am anfang disabled sein weil noch kein name da ist
  expect(button.attributes("disabled")).toBeDefined();
});

it("button geht wenn man einen namen eingibt", async () => {
  const wrapper = mount(StartMenu, {
    global: { stubs: { "b-button": meinButtonErsatz } }
  });

  // name reinschreiben wie ein user das machen wuerde
  await wrapper.find("input").setValue("David");

  const button = wrapper.findAll("button")[0];
  // jetzt sollte disabled weg sein
  expect(button.attributes("disabled")).toBeUndefined();
});

it("klick auf host button schickt event mit rolle host", async () => {
  const wrapper = mount(StartMenu, {
    global: { stubs: { "b-button": meinButtonErsatz } }
  });

  await wrapper.find("input").setValue("David");
  // jetzt auf host klicken
  await wrapper.find(".btn-host").trigger("click");

  // schauen was die komponente rausgeschickt hat
  const event = wrapper.emitted("spiel-starten");
  expect(event[0][0].rolle).toBe("host");
});