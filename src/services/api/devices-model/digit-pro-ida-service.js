import { prismaClient } from "../../applications/database.js";
import { ResponseError } from "../../errors/response-error.js";

// create
export const createService = async (user, dataMeasurement) => {
  try {
    let patientHandler = null;

    // Check if device_id not found
    const device = await prismaClient.deviceConnected.findFirst({
      where: {
        id: dataMeasurement.device_id,
      },
    });

    if (!device) {
      throw new ResponseError(401, "Device not found");
    }

    // Check patient handler
    patientHandler = await prismaClient.patientHandler.findFirst({
      where: {
        user_id: user.id,
        patient_id: dataMeasurement.patient_id,
        device_id: dataMeasurement.device_id,
      },
    });

    // Check if patient handler exist
    if (!patientHandler) {
      // Create patient handler
      patientHandler = await prismaClient.patientHandler.create({
        data: {
          user_id: user.id,
          patient_id: dataMeasurement.patient_id,
          device_id: dataMeasurement.device_id,
        },
      });
    } else {
      await prismaClient.patientHandler.update({
        where:{
          id: patientHandler.id
        },
        data: {
          user_id: patientHandler.user_id,
          patient_id: patientHandler.patient_id,
          device_id: patientHandler.device_id,
        }
      })
    }

    // get baby
    const baby = await prismaClient.baby.findUnique({
      where: {
        id: dataMeasurement.baby_id,
      },
      select: {
        name: true,
      }
    })

    // Save Measurement Activity
    const measurementActivity = await prismaClient.measurementActivity.create({
      data: {
        patient_handler_id: patientHandler.id,
        title: `Pengukuran Berat Badan Ibu dan Anak. ${baby.name}`,
        description: dataMeasurement.description ? dataMeasurement.description : `Hasil pengukuran berat badan Ibu : ${dataMeasurement.weight_mother} kg dan Anak : ${dataMeasurement.weight_child} kg` ,
      }
    })

    // Create history
    const historyMeasurement =  await prismaClient.measurementHistoriesDigitProIda.create({
      data: {
        baby_id: dataMeasurement.baby_id,
        weight_mother: dataMeasurement.weight_mother,
        weight_child: dataMeasurement.weight_child,
        patient_handler_id: patientHandler.id,
      },
    });

    return {
      id: historyMeasurement.id,
      weight_mother: historyMeasurement.weight_mother,
      weight_child: historyMeasurement.weight_child,
      description: measurementActivity.description
    }
  } catch (error) {
    throw error;
  }
};

export const getAllService = async (query, page, limit, skip, patient_id) => {
  try {
    const whereCondition = {};

    if (query) {
      whereCondition.OR = [
        {
          patient_handler: {
            user: {
              name: {
                contains: query
              }
            }
          }
        },
        {
          patient_handler: {
            device_connected: {
              name: {
                contains: query
              }
            }
          }
        },
        {
          patient_handler: {
            patient: {
              name: {
                contains: query
              }
            }
          }
        },
        {
          patient_handler: {
            patient: {
              babies:  {
                some: {
                  name: {
                    contains: query
                  }
                }
              }
            }
          }
        }
      ];
    }

    if (patient_id) {
      whereCondition.patient_handler = {
        ...(whereCondition.patient_handler || {}),
        patient: {
          ...(whereCondition.patient_handler?.patient || {}),
          id: patient_id,
        },
      };
    }

    const total = await prismaClient.measurementHistoriesDigitProIda.count({
      where: whereCondition,
    });

    const histories =
      await prismaClient.measurementHistoriesDigitProIda.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          recorded_at: "desc",
        },
        select: {
          id: true,
          weight_mother: true,
          weight_child: true,
          recorded_at: true,
          patient_handler: {
            select: {
              id: true,
              patient: {
                select: {
                  id: true,
                  name: true,
                  gender: true,
                  phone: true,
                  place_of_birth: true,
                  date_of_birth: true,
                },
              },
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
              device_connected: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

    const patientIds = histories
      .map((h) => h.patient_handler?.patient?.id)
      .filter(Boolean);

    const babies = await prismaClient.baby.findMany({
      where: {
        patient_id: {
          in: patientIds,
        },
      },
    });

    const dataWithBaby = histories.map((history) => ({
      ...history,
      patient_handler: {
        ...history.patient_handler,
        baby: babies.find(
          (baby) => baby.patient_id === history.patient_handler?.patient?.id
        ),
      },
    }));

    return {
      total,
      page,
      limit,
      data: dataWithBaby,
    };
  } catch (error) {
    throw error;
  }
};

export const getByPatientIdService = async (query, page, limit, skip, patientId) => {
  try {
    const whereCondition = {};

    if (query) {
      whereCondition.OR = [
        {
          patient_handler: {
            user: {
              name: {
                contains: query
              }
            }
          }
        },
        {
          patient_handler: {
            device_connected: {
              name: {
                contains: query
              }
            }
          }
        },
        {
          patient_handler: {
            patient: {
              babies:  {
                some: {
                  name: {
                    contains: query
                  }
                }
              }
            }
          }
        }
      ];
    }

    whereCondition.patient_handler = {
      ...(whereCondition.patient_handler || {}),
      patient: {
        ...(whereCondition.patient_handler?.patient || {}),
        id: patientId,
      },
    };

    const total = await prismaClient.measurementHistoriesDigitProIda.count({
      where: whereCondition,
    });

    const histories =
        await prismaClient.measurementHistoriesDigitProIda.findMany({
          where: whereCondition,
          skip: skip,
          take: limit,
          orderBy: {
            recorded_at: "desc",
          },
          select: {
            id: true,
            weight_mother: true,
            weight_child: true,
            recorded_at: true,
            patient_handler: {
              select: {
                id: true,
                patient: {
                  select: {
                    id: true,
                    name: true,
                    gender: true,
                    phone: true,
                    place_of_birth: true,
                    date_of_birth: true,
                  },
                },
                device_connected: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        });

    const patientIds = histories
        .map((h) => h.patient_handler?.patient?.id)
        .filter(Boolean);

    const babies = await prismaClient.baby.findMany({
      where: {
        patient_id: {
          in: patientIds,
        },
      },
    });

    const dataWithBaby = histories.map((h) => ({
      ...h,
      patient_handler: {
        ...h.patient_handler,
        baby: babies.find(
            (b) => b.patient_id === h.patient_handler?.patient?.id
        ),
      },
    }));

    return {
      total,
      page,
      limit,
      data: dataWithBaby,
    };
  } catch (error) {
    throw error;
  }
};

export const getByDeviceIdService = async (query, page, limit, skip, deviceId) => {
  try {
    const whereCondition = {}

    if (query)  {
      whereCondition.OR = [
        {
          patient_handler: {
            user: {
              name: {
                contains: query
              }
            }
          }
        },
        {
          patient_handler: {
            patient: {
              name: {
                contains: query
              }
            }
          }
        },
        {
          patient_handler: {
            patient: {
              babies:  {
                some: {
                  name: {
                    contains: query
                  }
                }
              }
            }
          }
        }
      ];
    }

    whereCondition.patient_handler = {
      ...(whereCondition.patient_handler || {}),
      device_id: deviceId,
    };

    const total = await prismaClient.measurementHistoriesDigitProIda.count({
      where: whereCondition,
    });

    const histories =
        await prismaClient.measurementHistoriesDigitProIda.findMany({
          where: whereCondition,
          skip: skip,
          take: limit,
          orderBy: {
            recorded_at: "desc",
          },
          select: {
            id: true,
            weight_mother: true,
            weight_child: true,
            recorded_at: true,
            patient_handler: {
              select: {
                id: true,
                patient: {
                  select: {
                    id: true,
                    name: true,
                    gender: true,
                    phone: true,
                    place_of_birth: true,
                    date_of_birth: true,
                  },
                },
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        });

    const patientIds = histories
        .map((h) => h.patient_handler?.patient?.id)
        .filter(Boolean);

    const babies = await prismaClient.baby.findMany({
      where: {
        patient_id: {
          in: patientIds,
        },
      },
    });

    const dataWithBaby = histories.map((h) => ({
      ...h,
      patient_handler: {
        ...h.patient_handler,
        baby: babies.find(
            (b) => b.patient_id === h.patient_handler?.patient?.id
        ),
      },
    }));

    return {
      total,
      page,
      limit,
      data: dataWithBaby,
    };
  } catch (error) {
    throw error;
  }
};

export const getByUserIdService = async (query, page, limit, skip, userId) => {
  try {
    const whereCondition = {}

    if (query) {
      whereCondition.OR = [
        {
          patient_handler: {
            device_connected: {
              name: {
                contains: query
              }
            }
          }
        },
        {
          patient_handler: {
            patient: {
              name: {
                contains: query
              }
            }
          }
        },
        {
          patient_handler: {
            patient: {
              babies:  {
                some: {
                  name: {
                    contains: query
                  }
                }
              }
            }
          }
        }
      ];
    }

    whereCondition.patient_handler = {
      ...(whereCondition.patient_handler || {}),
      user_id: userId,
    };

    const total = await prismaClient.measurementHistoriesDigitProIda.count({
      where: whereCondition,
    });

    const histories =
        await prismaClient.measurementHistoriesDigitProIda.findMany({
          where: whereCondition,
          skip: skip,
          take: limit,
          orderBy: {
            recorded_at: "desc",
          },
          select: {
            id: true,
            weight_mother: true,
            weight_child: true,
            recorded_at: true,
            patient_handler: {
              select: {
                id: true,
                patient: {
                  select: {
                    id: true,
                    name: true,
                    gender: true,
                    phone: true,
                    place_of_birth: true,
                    date_of_birth: true,
                  },
                },
                device_connected: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              },
            },
          },
        });

    const patientIds = histories
        .map((h) => h.patient_handler?.patient?.id)
        .filter(Boolean);

    const babies = await prismaClient.baby.findMany({
      where: {
        patient_id: {
          in: patientIds,
        },
      },
    });

    const dataWithBaby = histories.map((h) => ({
      ...h,
      patient_handler: {
        ...h.patient_handler,
        baby: babies.find(
            (b) => b.patient_id === h.patient_handler?.patient?.id
        ),
      },
    }));

    return {
      total,
      page,
      limit,
      data: dataWithBaby,
    };
  } catch (error) {
    throw error;
  }
};
