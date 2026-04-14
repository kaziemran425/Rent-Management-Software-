<template>
  <q-page class="q-pa-lg">
    <div class="row q-col-gutter-lg">
      <div class="col-12">
        <div class="text-h4 text-bold text-indigo-9">Welcome Back, Rahim!</div>
        <div class="text-subtitle1 text-grey-7">Here is what's happening with your apartment today.</div>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="bg-indigo-9 text-white shadow-5" style="height: 150px">
          <q-card-section>
            <div class="text-subtitle2 opacity-80">Next Rent Due</div>
            <div class="text-h4 text-bold q-mt-sm">May 05, 2026</div>
            <div class="text-caption">Amount: ৳ 12,500</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="bg-white text-indigo-9 shadow-2" style="height: 150px">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">Active Complaints</div>
            <div class="text-h4 text-bold q-mt-sm">01</div>
            <div class="text-caption text-orange-9">Status: In Progress</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="bg-white text-indigo-9 shadow-2" style="height: 150px">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">Recent Notice</div>
            <div class="text-h6 text-bold q-mt-sm">Water Tank Cleaning</div>
            <div class="text-caption">Scheduled for April 20th</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card flat bordered class="bg-white">
          <q-card-section class="row items-center">
            <div class="text-h6 text-bold">Recent Payment History</div>
            <q-space />
            <q-btn flat color="primary" label="View All" to="/RentRecord" />
          </q-card-section>
          <q-separator />
          <q-list separator>
            <q-item v-for="n in 3" :key="n">
              <q-item-section avatar>
                <q-icon name="check_circle" color="positive" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">March 2026 Rent</q-item-label>
                <q-item-label caption>Paid via Online Banking</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="text-bold text-dark">৳ 12,500</div>
                <div class="text-caption">05 Mar</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-indigo-1">
          <q-card-section>
            <div class="text-h6 text-bold text-indigo-9">Quick Actions</div>
          </q-card-section>
          <q-card-section class="q-gutter-y-sm">
            <q-btn icon="campaign" label="Read Notices" class="full-width" color="white" text-color="indigo-9" unelevated />
            <q-btn icon="add_comment" label="Report Issue" class="full-width" color="indigo-9" unelevated to="/Complaint" />
            <q-btn icon="download" label="Get Agreement" class="full-width" outline color="indigo-9" to="/Agreement" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>