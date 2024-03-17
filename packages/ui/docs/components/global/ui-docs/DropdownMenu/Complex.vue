<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIDropdownMenu as DD } from "~ui/DropdownMenu";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame>
    <DD.Root>
      <DD.Trigger as-child>
        <UIButton>Open</UIButton>
      </DD.Trigger>
      <DD.Content>
        <DD.Label class="font-semibold">
          My Account
        </DD.Label>
        <DD.Separator />
        <DD.Group>
          <DD.Item>
            <DD.ItemIcon icon="i-lucide:user" />
            <DD.ItemTitle>Profile</DD.ItemTitle>
            <DD.ItemMeta>
              <span class="i-lucide:arrow-big-up block" />
              <span class="i-lucide:command block" />
              &ThinSpace;P
            </DD.ItemMeta>
          </DD.Item>
          <DD.Item>
            <DD.ItemIcon icon="i-lucide:credit-card" />
            <DD.ItemTitle>Billing</DD.ItemTitle>
            <DD.ItemMeta>
              <span class="i-lucide:command block" />
              &ThinSpace;B
            </DD.ItemMeta>
          </DD.Item>
          <DD.Item>
            <DD.ItemIcon icon="i-lucide:settings" />
            <DD.ItemTitle>Settings</DD.ItemTitle>
            <DD.ItemMeta>
              <span class="i-lucide:command block" />
              &ThinSpace;S
            </DD.ItemMeta>
          </DD.Item>
          <DD.Item>
            <DD.ItemIcon icon="i-lucide:keyboard" />
            <DD.ItemTitle>Keyboard shortcuts</DD.ItemTitle>
            <DD.ItemMeta>
              <span class="i-lucide:command block" />
              &ThinSpace;K
            </DD.ItemMeta>
          </DD.Item>
        </DD.Group>
        <DD.Separator />
        <DD.Group>
          <DD.Item>
            <DD.ItemIcon icon="i-lucide:users" />
            <DD.ItemTitle>Team</DD.ItemTitle>
          </DD.Item>

          <DD.Sub>
            <DD.SubTrigger as-child>
              <DD.Item>
                <DD.ItemIcon icon="i-lucide:user-plus" />
                <DD.ItemTitle>Invite users</DD.ItemTitle>
                <DD.ItemMeta><span class="i-lucide:chevron-right block" /></DD.ItemMeta>
              </DD.Item>
            </DD.SubTrigger>
            <DD.SubContent>
              <DD.Group>
                <DD.Item>
                  <DD.ItemIcon icon="i-lucide:mail" />
                  <DD.ItemTitle>Email</DD.ItemTitle>
                </DD.Item>
                <DD.Item>
                  <DD.ItemIcon icon="i-lucide:message-square" />
                  <DD.ItemTitle>Message</DD.ItemTitle>
                </DD.Item>
                <DD.Separator />
                <DD.Item>
                  <DD.ItemIcon icon="i-lucide:plus-circle" />
                  <DD.ItemTitle>More...</DD.ItemTitle>
                </DD.Item>
              </DD.Group>
            </DD.SubContent>
          </DD.Sub>

          <DD.Item>
            <DD.ItemIcon icon="i-lucide:plus" />
            <DD.ItemTitle>New team</DD.ItemTitle>
            <DD.ItemMeta>
              <span class="i-lucide:command block" />
              &ThinSpace;T
            </DD.ItemMeta>
          </DD.Item>
        </DD.Group>
        <DD.Separator />
        <DD.Group>
          <DD.Item>
            <DD.ItemIcon icon="i-lucide:github" />
            <DD.ItemTitle>GitHub</DD.ItemTitle>
          </DD.Item>
          <DD.Item>
            <DD.ItemIcon icon="i-lucide:life-buoy" />
            <DD.ItemTitle>Support</DD.ItemTitle>
          </DD.Item>
          <DD.Item disabled>
            <DD.ItemIcon icon="i-lucide:cloud" />
            <DD.ItemTitle>API</DD.ItemTitle>
          </DD.Item>
        </DD.Group>
        <DD.Separator />
        <DD.Item>
          <DD.ItemIcon icon="i-lucide:log-out" />
          <DD.ItemTitle>Log Out</DD.ItemTitle>
          <DD.ItemMeta>
            <span class="i-lucide:arrow-big-up block" />
            <span class="i-lucide:command block" />
            &ThinSpace;Q
          </DD.ItemMeta>
        </DD.Item>
      </DD.Content>
    </DD.Root>
  </PreviewFrame>
</template>
